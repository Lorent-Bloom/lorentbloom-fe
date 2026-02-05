"use server";

import {
  getSupabaseServerClient,
  type Conversation,
} from "@shared/api/supabase";
import { getCustomer } from "@entities/customer";
import type { SendMessageInput, Message } from "../../model/interface";

export async function sendMessage(input: SendMessageInput): Promise<{
  success: boolean;
  data?: Message;
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

    // Get conversation to verify access and determine role
    const { data: conversationData } = await db
      .from("conversations")
      .select("*")
      .eq("id", input.conversationId)
      .single();

    const conversation = conversationData as Conversation | null;

    if (!conversation) {
      return { success: false, error: "Conversation not found" };
    }

    // Verify user is part of this conversation (check JSONB owner/receiver email)
    const isOwner = conversation.owner?.email === customer.email;
    const isReceiver = conversation.receiver?.email === customer.email;

    if (!isOwner && !isReceiver) {
      return { success: false, error: "Access denied" };
    }

    const senderRole = isOwner ? "owner" : "receiver";

    // Insert message
    const { data: message, error } = await db
      .from("conversation_messages")
      .insert({
        conversation_id: input.conversationId,
        sender_id: customer.email,
        sender_role: senderRole,
        content: input.content || null,
        image_keys: input.imageKeys || [],
        is_system_message: false,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Update conversation last_message_at
    await db
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", input.conversationId);

    return { success: true, data: message as Message };
  } catch (error) {
    console.error("Failed to send message:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getMessages(conversationId: string): Promise<{
  success: boolean;
  data?: Message[];
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

    // Verify user has access to this conversation (JSONB query by email)
    const { data: conversation } = await db
      .from("conversations")
      .select("id")
      .eq("id", conversationId)
      .or(
        `owner->>email.eq.${customer.email},receiver->>email.eq.${customer.email}`,
      )
      .single();

    if (!conversation) {
      return {
        success: false,
        error: "Conversation not found or access denied",
      };
    }

    // Get messages
    const { data: messages, error } = await db
      .from("conversation_messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: (messages as Message[]) || [] };
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
