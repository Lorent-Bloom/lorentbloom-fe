"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabaseBrowserClient } from "@shared/api/supabase";
import { getConversations, markConversationAsRead } from "../api/action/server";
import type { ConversationWithUnread } from "../model/interface";

export const useConversations = (currentUserId: string) => {
  const [conversations, setConversations] = useState<ConversationWithUnread[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    const result = await getConversations();
    if (result.success && result.data) {
      setConversations(result.data);
      setError(null);
    } else {
      setError(result.error || "Failed to fetch conversations");
    }
    setIsLoading(false);
  }, []);

  // Initial fetch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchConversations();
  }, [fetchConversations]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!currentUserId) return;

    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel("conversations-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        () => {
          // Refetch on any conversation change
          fetchConversations();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          // Refetch on new message to update last_message and unread
          fetchConversations();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, fetchConversations]);

  const selectConversation = useCallback(async (conversationId: string) => {
    setSelectedId(conversationId);

    // Mark as read
    await markConversationAsRead(conversationId);

    // Update local state to reflect read status
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
      ),
    );
  }, []);

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  const totalUnreadCount = conversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0,
  );

  return {
    conversations,
    selectedConversation,
    selectedId,
    selectConversation,
    isLoading,
    error,
    totalUnreadCount,
    refetch: fetchConversations,
  };
};
