"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getSupabaseBrowserClient } from "@shared/api/supabase";
import {
  getMessages,
  sendMessage as sendMessageAction,
} from "../api/action/server";
import type { Message, SendMessageInput } from "../model/interface";

export const useMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    setIsLoading(true);
    const result = await getMessages(conversationId);

    if (result.success && result.data) {
      setMessages(result.data);
      setError(null);
    } else {
      setError(result.error || "Failed to fetch messages");
    }
    setIsLoading(false);
  }, [conversationId]);

  // Initial fetch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchMessages();
  }, [fetchMessages]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!conversationId) return;

    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "conversation_messages", // Correct table name
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === newMessage.id)) {
              return prev;
            }
            return [...prev, newMessage];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (input: Omit<SendMessageInput, "conversationId">) => {
      if (!conversationId)
        return { success: false, error: "No conversation selected" };

      setIsSending(true);
      const result = await sendMessageAction({
        ...input,
        conversationId,
      });

      if (result.success && result.data) {
        // The realtime subscription will add the message
        // But we can also optimistically add it here
        setMessages((prev) => {
          if (prev.some((m) => m.id === result.data!.id)) {
            return prev;
          }
          return [...prev, result.data!];
        });
      }

      setIsSending(false);
      return result;
    },
    [conversationId],
  );

  return {
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
    scrollRef,
    refetch: fetchMessages,
  };
};
