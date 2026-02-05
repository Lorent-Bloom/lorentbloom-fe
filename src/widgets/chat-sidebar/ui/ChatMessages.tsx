"use client";

import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { MessageBubble, SystemMessage, type Message } from "@entities/message";
import { STEP_I18N_KEYS, type ConversationStep } from "@entities/flow-step";

interface ChatMessagesProps {
  messages: Message[];
  steps: ConversationStep[];
  currentUserId: string;
  isLoading: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatMessages({
  messages,
  steps,
  currentUserId,
  isLoading,
  scrollRef,
}: ChatMessagesProps) {
  const t = useTranslations("chat-sidebar");
  const tSteps = useTranslations("flow-step");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">{t("noMessages")}</p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => {
        if (message.is_system_message) {
          const step = message.step_id
            ? steps.find((s) => s.id === message.step_id)
            : null;
          const stepI18nKey = step ? STEP_I18N_KEYS[step.step_key] : null;
          const stepName = stepI18nKey
            ? // @ts-expect-error - dynamic key pattern
              tSteps(`steps.${stepI18nKey}.name`, { defaultValue: step?.name })
            : step?.name;

          return (
            <SystemMessage
              key={message.id}
              message={message}
              stepName={stepName}
            />
          );
        }

        return (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.sender_id === currentUserId}
          />
        );
      })}
    </div>
  );
}
