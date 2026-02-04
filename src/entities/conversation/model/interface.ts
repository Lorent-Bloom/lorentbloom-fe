import type { Conversation as ConversationDB } from "@shared/api/supabase";

export type Conversation = ConversationDB;

export interface ConversationWithUnread extends Conversation {
  unreadCount: number;
  lastMessage?: {
    content: string | null;
    created_at: string;
    sender_role: "owner" | "receiver" | "system";
  };
}

export interface CreateConversationInput {
  orderId: string;
  ownerId: string;
  receiverId: string;
  ownerEmail: string;
  receiverEmail: string;
  ownerName?: string;
  receiverName?: string;
}

export interface ConversationItemProps {
  conversation: ConversationWithUnread;
  isSelected: boolean;
  currentUserId: string;
  onClick: () => void;
}
