"use client";

import { useState, useEffect, useCallback } from "react";
import { useMessages } from "@entities/message";
import { getConversation } from "@entities/conversation";
import {
  getFlowSteps,
  getConversationProgress,
  type ConversationStep,
  type ConversationProgress,
} from "@entities/flow-step";
import type { Conversation } from "@entities/conversation";

export const useChatWindow = (conversationId: string) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [steps, setSteps] = useState<ConversationStep[]>([]);
  const [completedSteps, setCompletedSteps] = useState<ConversationProgress[]>(
    [],
  );
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);

  const {
    messages,
    isLoading: isLoadingMessages,
    isSending,
    error: messagesError,
    sendMessage,
    scrollRef,
    refetch: refetchMessages,
  } = useMessages(conversationId);

  // Fetch conversation details
  useEffect(() => {
    const fetchConversation = async () => {
      setIsLoadingConversation(true);
      const result = await getConversation(conversationId);
      if (result.success && result.data) {
        setConversation(result.data);
      }
      setIsLoadingConversation(false);
    };

    if (conversationId) {
      fetchConversation();
    }
  }, [conversationId]);

  // Fetch flow steps
  useEffect(() => {
    const fetchSteps = async () => {
      const result = await getFlowSteps();
      if (result.success && result.data) {
        setSteps(result.data);
      }
    };
    fetchSteps();
  }, []);

  // Fetch progress
  const fetchProgress = useCallback(async () => {
    if (!conversationId) return;
    const result = await getConversationProgress(conversationId);
    if (result.success && result.data) {
      setCompletedSteps(result.data);
    }
  }, [conversationId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchProgress();
  }, [fetchProgress]);

  // Get current step
  const currentStep = conversation?.current_step_id
    ? steps.find((s) => s.id === conversation.current_step_id) || null
    : null;

  const handleSendMessage = useCallback(
    async (content?: string, imageKeys?: string[]) => {
      return sendMessage({ content, imageKeys });
    },
    [sendMessage],
  );

  const handleStepComplete = useCallback(() => {
    // Refetch conversation to get updated current_step_key
    getConversation(conversationId).then((result) => {
      if (result.success && result.data) {
        setConversation(result.data);
      }
    });
    // Refetch progress
    fetchProgress();
    // Refetch messages to show system message
    refetchMessages();
  }, [conversationId, fetchProgress, refetchMessages]);

  return {
    conversation,
    messages,
    steps,
    currentStep,
    completedSteps,
    isLoading: isLoadingConversation || isLoadingMessages,
    isSending,
    error: messagesError,
    sendMessage: handleSendMessage,
    scrollRef,
    handleStepComplete,
  };
};
