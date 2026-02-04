"use client";

import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { cn } from "@shared/lib/utils";
import { ChatSidebar } from "@widgets/chat-sidebar";
import { useChatIcon } from "../lib/useChatIcon";
import type { ChatIconProps } from "../model/interface";

interface ChatIconClientProps extends ChatIconProps {
  currentUserId: string;
}

export function ChatIconClient({ className, currentUserId }: ChatIconClientProps) {
  const { unreadCount, isOpen, handleClick, handleClose } = useChatIcon(currentUserId);
  const t = useTranslations("chat-icon");

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn("relative", className)}
        onClick={handleClick}
        aria-label={t("ariaLabel")}
      >
        <MessageCircle className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full p-0 text-xs flex items-center justify-center"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      <ChatSidebar
        isOpen={isOpen}
        onClose={handleClose}
        currentUserId={currentUserId}
      />
    </>
  );
}
