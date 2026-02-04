"use client";

import { useState, useCallback, useRef } from "react";
import { useChatImageUpload } from "./useChatImageUpload";
import type { ChatInputProps, UseChatInputReturn } from "../model/interface";

export const useChatInput = ({
  onSend,
}: Pick<ChatInputProps, "onSend">): UseChatInputReturn => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    imageKeys,
    isUploading,
    handleUpload,
    removeImage,
    clearImages,
  } = useChatImageUpload();

  const handleSubmit = useCallback(async () => {
    const trimmedMessage = message.trim();

    // Need either message content or images
    if (!trimmedMessage && imageKeys.length === 0) {
      return;
    }

    setIsSending(true);

    const result = await onSend(
      trimmedMessage || undefined,
      imageKeys.length > 0 ? imageKeys : undefined
    );

    if (result.success) {
      setMessage("");
      clearImages();
      inputRef.current?.focus();
    }

    setIsSending(false);
  }, [message, imageKeys, onSend, clearImages]);

  const handleImageUpload = useCallback(
    async (files: File[]) => {
      await handleUpload(files);
    },
    [handleUpload]
  );

  return {
    message,
    setMessage,
    imageKeys,
    isUploading,
    isSending,
    handleSubmit,
    handleImageUpload,
    removeImage,
    inputRef,
  };
};
