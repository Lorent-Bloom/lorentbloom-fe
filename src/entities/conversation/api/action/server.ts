"use server";

import { cookies } from "next/headers";
import { getSupabaseServerClient, type Conversation, type ConversationParticipant } from "@shared/api/supabase";
import { sendFlowStepNotification } from "@shared/api/resend";
import { TOKEN_COOKIE_NAME } from "@shared/api/apollo/model/const";
import { getCustomer } from "@entities/customer";
import type { CreateConversationInput, ConversationWithUnread } from "../../model/interface";

export async function createConversation(input: CreateConversationInput) {
  try {
    const supabase = await getSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    // Build owner and receiver JSONB objects
    const owner: ConversationParticipant = {
      id: input.ownerId,
      email: input.ownerEmail,
      name: input.ownerName || null,
    };

    const receiver: ConversationParticipant = {
      id: input.receiverId,
      email: input.receiverEmail,
      name: input.receiverName || null,
    };

    // Create conversation - start at step 2 (money_sent) since step 1 (order_created)
    // is system-triggered and auto-completed upon conversation creation
    const { data: conversation, error } = await db
      .from("conversations")
      .insert({
        order_id: input.orderId,
        owner,
        receiver,
        current_step_id: 2, // money_sent step (next step after order_created)
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create conversation:", error);
      return { success: false, error: error.message };
    }

    // Create initial system message for order_created step
    await db.from("conversation_messages").insert({
      conversation_id: conversation.id,
      sender_id: "system",
      sender_role: "system",
      is_system_message: true,
      step_id: 1, // order_created step
    });

    // Record progress for completed order_created step
    await db.from("conversation_progress").insert({
      conversation_id: conversation.id,
      step_id: 1, // order_created step (auto-completed)
      completed_by: 0, // system
    });

    // Send email notifications to both parties
    const notifications = [
      {
        to: input.ownerEmail,
        recipientName: input.ownerName || "Owner",
        orderNumber: input.orderId,
        stepKey: "order_created",
        stepName: "Order Created",
        stepDescription: "A new rental order has been placed for your product.",
        locale: "en",
      },
      {
        to: input.receiverEmail,
        recipientName: input.receiverName || "Customer",
        orderNumber: input.orderId,
        stepKey: "order_created",
        stepName: "Order Created",
        stepDescription: "Your rental order has been confirmed.",
        locale: "en",
      },
    ];

    // Send notifications in parallel
    await Promise.all(notifications.map(sendFlowStepNotification));

    return { success: true, data: conversation as Conversation };
  } catch (error) {
    console.error("Failed to create conversation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getConversations(): Promise<{
  success: boolean;
  data?: ConversationWithUnread[];
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;

    if (!token) {
      return { success: false, error: "Unauthorized" };
    }

    const customer = await getCustomer();
    if (!customer?.email) {
      return { success: false, error: "Customer not found" };
    }

    const supabase = await getSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    // Get conversations where user is owner or receiver (using JSONB operators)
    // Search by email since that's what we have access to from the customer query
    const { data: conversations, error } = await db
      .from("conversations")
      .select("*")
      .or(`owner->>email.eq.${customer.email},receiver->>email.eq.${customer.email}`)
      .order("last_message_at", { ascending: false, nullsFirst: false });

    if (error) {
      console.error("Failed to fetch conversations:", error);
      return { success: false, error: error.message };
    }

    // Get unread counts and last messages for each conversation
    const conversationsWithUnread: ConversationWithUnread[] = await Promise.all(
      ((conversations as Conversation[]) || []).map(async (conv) => {
        // Get last read time for this user
        const { data: readData } = await db
          .from("conversation_message_reads")
          .select("last_read_at")
          .eq("conversation_id", conv.id)
          .eq("user_id", customer.email)
          .single();

        const lastReadAt = readData?.last_read_at || conv.created_at;

        // Count unread messages
        const { count } = await db
          .from("conversation_messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", conv.id)
          .gt("created_at", lastReadAt)
          .neq("sender_id", customer.email);

        // Get last message
        const { data: lastMessageData } = await db
          .from("conversation_messages")
          .select("content, created_at, sender_role")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        return {
          ...conv,
          unreadCount: count || 0,
          lastMessage: lastMessageData || undefined,
        };
      })
    );

    return { success: true, data: conversationsWithUnread };
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getConversation(conversationId: string) {
  try {
    const customer = await getCustomer();
    if (!customer?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = await getSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    const { data, error } = await db
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .or(`owner->>email.eq.${customer.email},receiver->>email.eq.${customer.email}`)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Conversation };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getTotalUnreadCount(): Promise<{
  success: boolean;
  count?: number;
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

    // Get all user's conversations
    const { data: conversations } = await db
      .from("conversations")
      .select("id, created_at")
      .or(`owner->>email.eq.${customer.email},receiver->>email.eq.${customer.email}`);

    if (!conversations || conversations.length === 0) {
      return { success: true, count: 0 };
    }

    let totalUnread = 0;

    for (const conv of conversations as { id: string; created_at: string }[]) {
      // Get last read time
      const { data: readData } = await db
        .from("conversation_message_reads")
        .select("last_read_at")
        .eq("conversation_id", conv.id)
        .eq("user_id", customer.email)
        .single();

      const lastReadAt = readData?.last_read_at || conv.created_at;

      // Count unread
      const { count } = await db
        .from("conversation_messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conv.id)
        .gt("created_at", lastReadAt)
        .neq("sender_id", customer.email);

      totalUnread += count || 0;
    }

    return { success: true, count: totalUnread };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function markConversationAsRead(conversationId: string) {
  try {
    const customer = await getCustomer();
    if (!customer?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const supabase = await getSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;

    // Upsert the read record
    const { error } = await db.from("conversation_message_reads").upsert(
      {
        conversation_id: conversationId,
        user_id: customer.email,
        last_read_at: new Date().toISOString(),
      },
      {
        onConflict: "conversation_id,user_id",
      }
    );

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
