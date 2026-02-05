"use server";

import {
  getSupabaseServerClient,
  type Conversation as DBConversation,
  type ConversationParticipant,
} from "@shared/api/supabase";
import type { Conversation } from "../../model/interface";

// TODO: Re-enable when email notifications are needed
// import { sendFlowStepNotification } from "@shared/api/resend";

export interface CreateConversationFromOrderInput {
  orderId: string;
  // Owner (product seller) info from parent_customer_info
  ownerId: string;
  ownerEmail?: string | null;
  ownerName?: string | null;
  // Receiver (buyer) info from customer_info
  receiverId: string;
  receiverEmail?: string | null;
  receiverName?: string | null;
}

/**
 * Creates a conversation for an order after it's placed.
 * Called from the checkout success flow or order placement.
 *
 * Owner = Product seller (the person who listed the item) - from parent_customer_info
 * Receiver = Customer/Buyer (the person renting the item) - from customer_info
 */
export async function createConversationFromOrder(
  input: CreateConversationFromOrderInput,
): Promise<{ success: boolean; data?: Conversation; error?: string }> {
  try {
    const supabase = await getSupabaseServerClient();

    // Check if conversation already exists for this order
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = (await (supabase as any)
      .from("conversations")
      .select("*")
      .eq("order_id", input.orderId)
      .maybeSingle()) as { data: DBConversation | null };

    if (existing) {
      // Conversation already exists, return it
      return { success: true, data: existing };
    }

    // Build owner and receiver JSONB objects from input
    const owner: ConversationParticipant = {
      id: input.ownerId,
      email: input.ownerEmail || null,
      name: input.ownerName || null,
    };

    const receiver: ConversationParticipant = {
      id: input.receiverId,
      email: input.receiverEmail || null,
      name: input.receiverName || null,
    };

    // Create conversation - start at step 2 (money_sent) since step 1 (order_created)
    // is system-triggered and auto-completed upon conversation creation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const insertResult = await (supabase as any)
      .from("conversations")
      .insert({
        order_id: input.orderId,
        owner,
        receiver,
        current_step_id: 2, // money_sent step (order_created is auto-completed)
      })
      .select()
      .single();

    const conversation = insertResult.data as DBConversation | null;
    const error = insertResult.error as { message: string } | null;

    if (error || !conversation) {
      console.error("Failed to create conversation:", error);
      return {
        success: false,
        error: error?.message || "Failed to create conversation",
      };
    }

    // Create initial system message
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("conversation_messages").insert({
      conversation_id: conversation.id,
      sender_id: "system",
      sender_role: "system",
      is_system_message: true,
      step_id: 1, // order_created step
    });

    // Record progress
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from("conversation_progress").insert({
      conversation_id: conversation.id,
      step_id: 1, // order_created step
      completed_by: 0, // system
    });

    // TODO: Send email notifications when we have valid email addresses

    return { success: true, data: conversation };
  } catch (error) {
    console.error("Failed to create conversation from order:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
