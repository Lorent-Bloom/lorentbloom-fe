"use client";

import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { ChatInput } from "@features/chat-input";
import { FlowStepAction } from "@features/flow-step-action";
import { useChatWindow } from "../lib/useChatWindow";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import type { ChatWindowProps } from "../model/interface";

export function ChatWindow({
  conversationId,
  currentUserId,
  onBack,
  showBackButton,
}: ChatWindowProps) {
  const t = useTranslations("chat-sidebar");

  const {
    conversation,
    messages,
    steps,
    currentStep,
    completedSteps,
    isLoading,
    isSending,
    sendMessage,
    scrollRef,
    handleStepComplete,
  } = useChatWindow(conversationId);

  if (isLoading && !conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">
          {t("conversationNotFound")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        conversation={conversation}
        steps={steps}
        currentUserId={currentUserId}
        onBack={onBack}
        showBackButton={showBackButton}
      />

      <FlowStepAction
        conversation={conversation}
        currentStep={currentStep}
        completedSteps={completedSteps}
        currentUserId={currentUserId}
        onStepComplete={handleStepComplete}
      />

      <ChatMessages
        messages={messages}
        steps={steps}
        currentUserId={currentUserId}
        isLoading={isLoading}
        scrollRef={scrollRef}
      />

      <ChatInput onSend={sendMessage} disabled={isSending} />
    </div>
  );
}
