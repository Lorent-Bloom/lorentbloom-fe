"use client";

import { useTranslations } from "next-intl";
import { MessageSquare, Loader2 } from "lucide-react";
import { useConversations, ConversationItem } from "@entities/conversation";
import { ScrollArea } from "@shared/ui/scroll-area";
import type { ChatListProps } from "../model/interface";

export function ChatList({ currentUserId, selectedId, onSelect }: ChatListProps) {
  const t = useTranslations("chat-sidebar");
  const { conversations, isLoading, error } = useConversations(currentUserId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">
          {t("noConversations")}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {t("noConversationsDescription")}
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isSelected={conversation.id === selectedId}
            currentUserId={currentUserId}
            onClick={() => onSelect(conversation.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
