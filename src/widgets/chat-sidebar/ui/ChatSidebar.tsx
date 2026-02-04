"use client";

import { useTranslations } from "next-intl";
import { MessageSquare } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@shared/ui/sheet";
import { cn } from "@shared/lib/utils";
import { useChatSidebar } from "../lib/useChatSidebar";
import { ChatList } from "./ChatList";
import { ChatWindow } from "./ChatWindow";
import type { ChatSidebarProps } from "../model/interface";

export function ChatSidebar({ isOpen, onClose, currentUserId }: ChatSidebarProps) {
  const t = useTranslations("chat-sidebar");

  const {
    selectedId,
    selectConversation,
    mobileView,
    handleBackToList,
  } = useChatSidebar(currentUserId);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        className={cn(
          "p-0 flex flex-col",
          "w-full sm:w-[90vw] md:w-[70vw] lg:w-[50vw] sm:max-w-none"
        )}
      >
        <SheetHeader className="px-4 py-3 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t("title")}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Desktop: Split view */}
          <div className="hidden lg:flex flex-1">
            {/* Conversations list - left panel */}
            <div className="w-[280px] border-r flex flex-col">
              <ChatList
                currentUserId={currentUserId}
                selectedId={selectedId}
                onSelect={selectConversation}
              />
            </div>

            {/* Chat window - right panel */}
            <div className="flex-1 flex flex-col">
              {selectedId ? (
                <ChatWindow
                  conversationId={selectedId}
                  currentUserId={currentUserId}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p className="text-sm">{t("selectConversation")}</p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: Single view with navigation */}
          <div className="lg:hidden flex-1 flex flex-col">
            {mobileView === "list" ? (
              <ChatList
                currentUserId={currentUserId}
                selectedId={selectedId}
                onSelect={selectConversation}
              />
            ) : selectedId ? (
              <ChatWindow
                conversationId={selectedId}
                currentUserId={currentUserId}
                onBack={handleBackToList}
                showBackButton
              />
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
