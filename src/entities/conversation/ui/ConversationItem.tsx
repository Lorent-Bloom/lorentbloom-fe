import { useTranslations } from "next-intl";
import { cn } from "@shared/lib/utils";
import { formatDistanceToNow } from "date-fns";
import type { ConversationItemProps } from "../model/interface";

export function ConversationItem({
  conversation,
  isSelected,
  currentUserId,
  onClick,
}: ConversationItemProps) {
  const t = useTranslations("conversation");

  // currentUserId is the email, so compare by email field
  const isOwner = conversation.owner?.email === currentUserId;
  const otherPartyName = isOwner
    ? conversation.receiver?.name || t("customer")
    : conversation.owner?.name || t("owner");

  const lastMessageTime = conversation.lastMessage?.created_at
    ? formatDistanceToNow(new Date(conversation.lastMessage.created_at), {
        addSuffix: true,
      })
    : null;

  const lastMessagePreview = conversation.lastMessage?.content
    ? conversation.lastMessage.content.length > 40
      ? `${conversation.lastMessage.content.substring(0, 40)}...`
      : conversation.lastMessage.content
    : conversation.lastMessage?.sender_role === "system"
      ? t("systemMessage")
      : null;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-3 border-b border-border transition-colors",
        "hover:bg-muted/50",
        isSelected && "bg-muted"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm truncate">
              {t("orderTitle", { orderNumber: conversation.order_id })}
            </span>
            {conversation.unreadCount > 0 && (
              <span className="flex-shrink-0 h-5 min-w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center px-1.5">
                {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {otherPartyName}
          </p>
          {lastMessagePreview && (
            <p className="text-xs text-muted-foreground truncate mt-1">
              {lastMessagePreview}
            </p>
          )}
        </div>
        {lastMessageTime && (
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {lastMessageTime}
          </span>
        )}
      </div>
    </button>
  );
}
