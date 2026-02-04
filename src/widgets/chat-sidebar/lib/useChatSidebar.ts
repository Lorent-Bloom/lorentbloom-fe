"use client";

import { useState, useCallback } from "react";
import { useConversations } from "@entities/conversation";

export const useChatSidebar = (currentUserId: string) => {
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const {
    conversations,
    selectedConversation,
    selectedId,
    selectConversation,
    isLoading,
    error,
    totalUnreadCount,
    refetch,
  } = useConversations(currentUserId);

  const handleSelectConversation = useCallback(
    (conversationId: string) => {
      selectConversation(conversationId);
      setMobileView("chat");
    },
    [selectConversation]
  );

  const handleBackToList = useCallback(() => {
    setMobileView("list");
  }, []);

  return {
    conversations,
    selectedConversation,
    selectedId,
    selectConversation: handleSelectConversation,
    isLoading,
    error,
    totalUnreadCount,
    refetch,
    mobileView,
    handleBackToList,
  };
};
