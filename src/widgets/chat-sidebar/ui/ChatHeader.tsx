"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@shared/ui/button";
import { FlowStepBadge, type ConversationStep } from "@entities/flow-step";
import { ChatReportButton } from "@features/chat-report";
import type { Conversation } from "@entities/conversation";

interface ChatHeaderProps {
  conversation: Conversation;
  steps: ConversationStep[];
  currentUserId: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function ChatHeader({
  conversation,
  steps,
  currentUserId,
  onBack,
  showBackButton,
}: ChatHeaderProps) {
  const t = useTranslations("chat-sidebar");
  const locale = useLocale();

  // currentUserId is the email, so compare by email field
  const isOwner = conversation.owner?.email === currentUserId;
  const otherPartyName = isOwner
    ? conversation.receiver?.name || t("customer")
    : conversation.owner?.name || t("owner");

  return (
    <div className="flex items-center gap-3 p-4 border-b bg-background">
      {showBackButton && onBack && (
        <Button variant="ghost" size="icon" onClick={onBack} className="lg:hidden">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm truncate">
            {t("orderTitle", { orderNumber: conversation.order_id })}
          </h3>
          <FlowStepBadge currentStepId={conversation.current_step_id} steps={steps} />
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {t("chatWith", { name: otherPartyName })}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <ChatReportButton conversationId={conversation.id} />
        <Link href={`/${locale}/account/order/view/${conversation.order_id}`}>
          <Button variant="ghost" size="icon" title={t("viewOrder")}>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
