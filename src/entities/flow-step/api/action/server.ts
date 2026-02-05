"use server";

import {
  getSupabaseServerClient,
  type ConversationStep,
  type ConversationProgress,
  type Conversation,
} from "@shared/api/supabase";
import { sendFlowStepNotification } from "@shared/api/resend";
import { getCustomer } from "@entities/customer";
import { DEFAULT_FLOW_STEPS } from "../../model/const";
import type { CompleteStepInput } from "../../model/interface";

export async function getFlowSteps(): Promise<{
  success: boolean;
  data?: ConversationStep[];
  error?: string;
}> {
  try {
    const supabase = await getSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    const { data, error } = await db
      .from("conversation_steps")
      .select("*")
      .order("step_order", { ascending: true });

    if (error) {
      console.error("[getFlowSteps] Failed to fetch from DB:", error);
      // Return default steps as fallback
      return {
        success: true,
        data: DEFAULT_FLOW_STEPS.map((step, index) => ({
          id: index + 1,
          step_key: step.stepKey,
          step_order: step.stepOrder,
          name: step.name,
          description: step.description || null,
          triggered_by: step.triggeredBy,
          required_action: step.requiredAction,
          notify_party: step.notifyParty,
          next_step_id: step.nextStepId,
          created_at: new Date().toISOString(),
        })),
      };
    }

    // If no data in DB, return default steps
    if (!data || data.length === 0) {
      return {
        success: true,
        data: DEFAULT_FLOW_STEPS.map((step, index) => ({
          id: index + 1,
          step_key: step.stepKey,
          step_order: step.stepOrder,
          name: step.name,
          description: step.description || null,
          triggered_by: step.triggeredBy,
          required_action: step.requiredAction,
          notify_party: step.notifyParty,
          next_step_id: step.nextStepId,
          created_at: new Date().toISOString(),
        })),
      };
    }

    return { success: true, data: (data as ConversationStep[]) || [] };
  } catch (error) {
    console.error("[getFlowSteps] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getConversationProgress(conversationId: string): Promise<{
  success: boolean;
  data?: ConversationProgress[];
  error?: string;
}> {
  try {
    const customer = await getCustomer();
    if (!customer?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = await getSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    const { data, error } = await db
      .from("conversation_progress")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("completed_at", { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: (data as ConversationProgress[]) || [] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function completeFlowStep(input: CompleteStepInput): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const customer = await getCustomer();
    if (!customer?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = await getSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    // Get the step configuration by ID
    const { data: stepData } = await db
      .from("conversation_steps")
      .select("*")
      .eq("id", input.stepId)
      .single();

    const step = stepData as ConversationStep | null;

    if (!step) {
      return { success: false, error: "Step not found" };
    }

    // Get conversation
    const { data: conversationData } = await db
      .from("conversations")
      .select("*")
      .eq("id", input.conversationId)
      .single();

    const conversation = conversationData as Conversation | null;

    if (!conversation) {
      return { success: false, error: "Conversation not found" };
    }

    // Determine user role (using JSONB owner/receiver)
    const isOwner = conversation.owner?.email === customer.email;
    const userRole = isOwner ? "owner" : "receiver";

    // Validate user can trigger this step
    if (step.triggered_by !== userRole && step.triggered_by !== "system") {
      return { success: false, error: "You cannot complete this step" };
    }

    // Validate current step matches
    if (conversation.current_step_id !== input.stepId) {
      return { success: false, error: "This step is not current" };
    }

    // Validate required actions
    if (
      (step.required_action === "upload_images" ||
        step.required_action === "both") &&
      (!input.imageKeys || input.imageKeys.length === 0)
    ) {
      return { success: false, error: "Images are required for this step" };
    }

    // Record progress (completed_by is now a number - use 0 for now, can be customerId if available)
    const { error: progressError } = await db
      .from("conversation_progress")
      .insert({
        conversation_id: input.conversationId,
        step_id: input.stepId,
        completed_by: 0, // TODO: Use actual customer ID when available
        image_keys: input.imageKeys || [],
      });

    if (progressError) {
      return { success: false, error: progressError.message };
    }

    // Update conversation to next step
    const { error: updateError } = await db
      .from("conversations")
      .update({
        current_step_id: step.next_step_id,
        last_message_at: new Date().toISOString(),
      })
      .eq("id", input.conversationId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // Create system message for step completion
    await db.from("conversation_messages").insert({
      conversation_id: input.conversationId,
      sender_id: customer.email,
      sender_role: userRole,
      is_system_message: true,
      step_id: input.stepId,
      image_keys: input.imageKeys || [],
    });

    // Send email notification
    const recipientEmail =
      step.notify_party === "owner"
        ? conversation.owner?.email
        : step.notify_party === "receiver"
          ? conversation.receiver?.email
          : null;

    const recipientName =
      step.notify_party === "owner"
        ? conversation.owner?.name
        : step.notify_party === "receiver"
          ? conversation.receiver?.name
          : null;

    if (recipientEmail && step.notify_party !== "both") {
      await sendFlowStepNotification({
        to: recipientEmail,
        recipientName: recipientName || "User",
        orderNumber: conversation.order_id,
        stepKey: step.step_key,
        stepName: step.name,
        stepDescription: step.description || undefined,
        locale: "en",
      });
    } else if (step.notify_party === "both") {
      // Notify both parties
      await Promise.all([
        sendFlowStepNotification({
          to: conversation.owner?.email || "",
          recipientName: conversation.owner?.name || "Owner",
          orderNumber: conversation.order_id,
          stepKey: step.step_key,
          stepName: step.name,
          stepDescription: step.description || undefined,
          locale: "en",
        }),
        sendFlowStepNotification({
          to: conversation.receiver?.email || "",
          recipientName: conversation.receiver?.name || "Customer",
          orderNumber: conversation.order_id,
          stepKey: step.step_key,
          stepName: step.name,
          stepDescription: step.description || undefined,
          locale: "en",
        }),
      ]);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to complete flow step:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
