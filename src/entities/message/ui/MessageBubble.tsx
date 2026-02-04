import Image from "next/image";
import { cn } from "@shared/lib/utils";
import { getUploadThingUrl } from "@shared/api/uploadthing/client";
import { format } from "date-fns";
import type { MessageBubbleProps } from "../model/interface";

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  const hasImages = message.image_keys && message.image_keys.length > 0;
  const hasContent = message.content && message.content.trim().length > 0;

  return (
    <div
      className={cn(
        "flex w-full mb-3",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2",
          isOwnMessage
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted rounded-bl-md"
        )}
      >
        {/* Images */}
        {hasImages && (
          <div
            className={cn(
              "grid gap-2 mb-2",
              message.image_keys!.length === 1 ? "grid-cols-1" : "grid-cols-2"
            )}
          >
            {message.image_keys!.map((key, index) => (
              <a
                key={key}
                href={getUploadThingUrl(key)}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-lg"
              >
                <Image
                  src={getUploadThingUrl(key)}
                  alt={`Image ${index + 1}`}
                  width={200}
                  height={200}
                  className="object-cover w-full h-auto max-h-48 hover:opacity-90 transition-opacity"
                />
              </a>
            ))}
          </div>
        )}

        {/* Text content */}
        {hasContent && (
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        )}

        {/* Timestamp */}
        <p
          className={cn(
            "text-xs mt-1",
            isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {format(new Date(message.created_at), "HH:mm")}
        </p>
      </div>
    </div>
  );
}
