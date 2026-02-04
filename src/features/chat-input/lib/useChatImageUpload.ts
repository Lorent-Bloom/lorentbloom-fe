"use client";

import { useState, useCallback } from "react";
import { useUploadThing } from "@shared/api/uploadthing/client";

export const useChatImageUpload = () => {
  const [imageKeys, setImageKeys] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { startUpload } = useUploadThing("chatImage", {
    onClientUploadComplete: (res) => {
      if (res) {
        const newKeys = res.map((r) => r.serverData.fileKey);
        setImageKeys((prev) => [...prev, ...newKeys]);
      }
      setIsUploading(false);
    },
    onUploadError: (error) => {
      setUploadError(error.message);
      setIsUploading(false);
    },
  });

  const handleUpload = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      // Limit to 5 images total
      const remainingSlots = 5 - imageKeys.length;
      if (remainingSlots <= 0) {
        setUploadError("Maximum 5 images allowed");
        return;
      }

      const filesToUpload = files.slice(0, remainingSlots);
      setIsUploading(true);
      setUploadError(null);

      try {
        await startUpload(filesToUpload);
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : "Upload failed");
        setIsUploading(false);
      }
    },
    [imageKeys.length, startUpload]
  );

  const removeImage = useCallback((index: number) => {
    setImageKeys((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearImages = useCallback(() => {
    setImageKeys([]);
  }, []);

  return {
    imageKeys,
    isUploading,
    uploadError,
    handleUpload,
    removeImage,
    clearImages,
  };
};
