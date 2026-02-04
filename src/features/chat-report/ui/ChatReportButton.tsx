"use client";

import { Flag } from "lucide-react";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@shared/ui";
import { useTranslations } from "next-intl";
import { useChatReportButton } from "../lib/useChatReportButton";
import { ChatReportModal } from "./ChatReportModal";
import type { ChatReportButtonProps } from "../model/interface";

export function ChatReportButton({ conversationId }: ChatReportButtonProps) {
  const t = useTranslations("chat-report");
  const { isModalOpen, handleOpenModal, handleCloseModal } =
    useChatReportButton();

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpenModal}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Flag className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("reportButton")}</p>
        </TooltipContent>
      </Tooltip>

      <ChatReportModal
        conversationId={conversationId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
