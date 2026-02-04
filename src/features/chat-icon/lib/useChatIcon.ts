"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabaseBrowserClient } from "@shared/api/supabase";
import { getTotalUnreadCount } from "@entities/conversation";
import type { UseChatIconReturn } from "../model/interface";

export const useChatIcon = (currentUserId: string): UseChatIconReturn => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    const result = await getTotalUnreadCount();
    if (result.success && typeof result.count === "number") {
      setUnreadCount(result.count);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (currentUserId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchUnreadCount();
    }
  }, [currentUserId, fetchUnreadCount]);

  // Subscribe to new messages for real-time badge updates
  useEffect(() => {
    if (!currentUserId) return;

    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel("unread-count")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "conversation_messages", // Correct table name
        },
        (payload) => {
          // Only increment if message is not from current user
          const message = payload.new as { sender_id: string };
          if (message.sender_id !== currentUserId) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  const handleClick = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Refetch unread count when closing (user may have read messages)
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return {
    unreadCount,
    isOpen,
    handleClick,
    handleClose,
  };
};
