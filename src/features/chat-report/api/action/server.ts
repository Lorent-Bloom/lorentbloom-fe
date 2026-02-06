"use server";

import {
  getSupabaseServerClient,
  type Conversation,
  type ConversationMessage,
  type ConversationStep,
  type ConversationProgress,
} from "@shared/api/supabase";
import { getCustomer } from "@entities/customer";
import { sendChatReportNotification } from "@shared/api/resend/sendNotification";
import { ADMIN_EMAIL } from "@shared/api/resend/model/const";
import { getUploadThingUrl } from "@shared/api/uploadthing/client";
import type { ChatReportEmailData } from "@shared/api/resend/model/interface";
import { verifyRecaptcha } from "@shared/lib/recaptcha";
import type { SubmitChatReportInput } from "../../model/interface";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lorentbloom.com";

async function getAdminEmails(): Promise<string[]> {
  const supabase = await getSupabaseServerClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const { data, error } = await db
    .from("admin_email_config")
    .select("email")
    .eq("is_active", true);

  if (error || !data || data.length === 0) {
    return [ADMIN_EMAIL];
  }

  return data.map((row: { email: string }) => row.email);
}

export async function submitChatReport(
  input: SubmitChatReportInput,
  recaptchaToken: string,
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const recaptchaResult = await verifyRecaptcha(
      recaptchaToken,
      "chat_report",
    );
    if (!recaptchaResult.success) {
      return { success: false, error: recaptchaResult.error };
    }

    const customer = await getCustomer();
    if (!customer?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = await getSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    // Fetch conversation
    const { data: conversationData, error: convError } = await db
      .from("conversations")
      .select("*")
      .eq("id", input.conversationId)
      .single();

    const conversation = conversationData as Conversation | null;

    if (convError || !conversation) {
      return { success: false, error: "Conversation not found" };
    }

    // Verify user is part of this conversation
    const isOwner = conversation.owner?.email === customer.email;
    const isReceiver = conversation.receiver?.email === customer.email;

    if (!isOwner && !isReceiver) {
      return { success: false, error: "Access denied" };
    }

    const reporterRole = isOwner ? "owner" : "receiver";

    // Fetch all messages
    const { data: messagesData, error: msgError } = await db
      .from("conversation_messages")
      .select("*")
      .eq("conversation_id", input.conversationId)
      .order("created_at", { ascending: true });

    if (msgError) {
      return { success: false, error: "Failed to fetch messages" };
    }

    const messages = (messagesData as ConversationMessage[]) || [];

    // Fetch flow steps
    const { data: stepsData, error: stepsError } = await db
      .from("conversation_steps")
      .select("*")
      .order("step_order", { ascending: true });

    if (stepsError) {
      return { success: false, error: "Failed to fetch steps" };
    }

    const steps = (stepsData as ConversationStep[]) || [];

    // Fetch completed steps
    const { data: progressData, error: progressError } = await db
      .from("conversation_progress")
      .select("*")
      .eq("conversation_id", input.conversationId)
      .order("completed_at", { ascending: true });

    if (progressError) {
      return { success: false, error: "Failed to fetch progress" };
    }

    const completedSteps = (progressData as ConversationProgress[]) || [];

    // Create chat report record
    const { data: report, error: reportError } = await db
      .from("chat_reports")
      .insert({
        conversation_id: input.conversationId,
        reporter_email: customer.email,
        reporter_role: reporterRole,
        description: input.description,
      })
      .select()
      .single();

    if (reportError) {
      return { success: false, error: "Failed to create report" };
    }

    // Get admin emails
    const adminEmails = await getAdminEmails();
    if (adminEmails.length === 0) {
      console.error("No admin emails configured");
      return {
        success: false,
        error: "No admin configured to receive reports",
      };
    }

    // Find current step name
    const currentStep = steps.find(
      (s) => s.id === conversation.current_step_id,
    );

    // Prepare email data
    const emailData: ChatReportEmailData = {
      reportId: report.id,
      orderId: conversation.order_id,
      reporterEmail: customer.email,
      reporterRole,
      ownerEmail: conversation.owner?.email || "Unknown",
      ownerName: conversation.owner?.name || "Owner",
      receiverEmail: conversation.receiver?.email || "Unknown",
      receiverName: conversation.receiver?.name || "Customer",
      problemDescription: input.description,
      messages: messages.map((msg) => ({
        senderRole: msg.sender_role,
        content: msg.content,
        imageUrls: (msg.image_keys || []).map(getUploadThingUrl),
        timestamp: msg.created_at,
        isSystemMessage: msg.is_system_message,
        stepName: msg.step_id
          ? steps.find((s) => s.id === msg.step_id)?.name
          : undefined,
      })),
      flowProgress: completedSteps.map((progress) => {
        const step = steps.find((s) => s.id === progress.step_id);
        return {
          stepName: step?.name || "Unknown step",
          completedAt: progress.completed_at,
          imageUrls: (progress.image_keys || []).map(getUploadThingUrl),
        };
      }),
      currentStepName: currentStep?.name || null,
      siteUrl: SITE_URL,
    };

    // Send email to all admins
    await Promise.all(
      adminEmails.map((email) =>
        sendChatReportNotification({
          to: email,
          data: emailData,
        }),
      ),
    );

    return { success: true };
  } catch (error) {
    console.error("Failed to submit chat report:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
