import type { ConversationMessage } from "@shared/api/supabase";

export type Message = ConversationMessage;

export interface SendMessageInput {
  conversationId: string;
  content?: string;
  imageKeys?: string[];
}

export interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export interface SystemMessageProps {
  message: Message;
  stepName?: string;
}
