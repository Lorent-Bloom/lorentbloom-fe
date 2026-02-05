"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import Image from "next/image";
import { Send, ImagePlus, X, Loader2 } from "lucide-react";
import { Button } from "@shared/ui/button";
import { Textarea } from "@shared/ui/textarea";
import { cn } from "@shared/lib/utils";
import { getUploadThingUrl } from "@shared/api/uploadthing/client";
import { useChatInput } from "../lib/useChatInput";
import type { ChatInputProps } from "../model/interface";

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const t = useTranslations("chat-input");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    message,
    setMessage,
    imageKeys,
    isUploading,
    isSending,
    handleSubmit,
    handleImageUpload,
    removeImage,
    inputRef,
  } = useChatInput({ onSend });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(Array.from(files));
      e.target.value = ""; // Reset input
    }
  };

  const isDisabled = disabled || isSending || isUploading;
  const canSend =
    (message.trim().length > 0 || imageKeys.length > 0) && !isDisabled;

  return (
    <div className="border-t bg-background p-3">
      {/* Image previews */}
      {imageKeys.length > 0 && (
        <div className="flex gap-2 mb-2 flex-wrap">
          {imageKeys.map((key, index) => (
            <div key={key} className="relative group">
              <Image
                src={getUploadThingUrl(key)}
                alt={`Upload ${index + 1}`}
                width={64}
                height={64}
                className="h-16 w-16 object-cover rounded-lg border"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 h-5 w-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={t("removeImage")}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {isUploading && (
            <div className="h-16 w-16 border rounded-lg flex items-center justify-center bg-muted">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={isDisabled || imageKeys.length >= 5}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={isDisabled || imageKeys.length >= 5}
          aria-label={t("uploadImage")}
        >
          <ImagePlus className="h-5 w-5" />
        </Button>

        <Textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("placeholder")}
          disabled={isDisabled}
          className={cn(
            "min-h-10 max-h-32 resize-none",
            "focus-visible:ring-1",
          )}
          rows={1}
        />

        <Button
          type="button"
          size="icon"
          className="shrink-0"
          onClick={handleSubmit}
          disabled={!canSend}
          aria-label={t("send")}
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
