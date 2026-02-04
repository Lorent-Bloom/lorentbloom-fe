"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  useUploadThing,
  getUploadThingUrl,
} from "@shared/api/uploadthing/client";
import type { UseLogoUploaderProps } from "../model/interface";

export const useLogoUploader = ({
  value,
  onChange,
  disabled,
}: UseLogoUploaderProps) => {
  const t = useTranslations("company-settings");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | undefined>(undefined);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing("companyLogo", {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      if (res && res[0]?.key) {
        onChange(res[0].key);
        setUploadError(undefined);
      }
    },
    onUploadError: (error) => {
      setIsUploading(false);
      setUploadError(error.message);
      console.error("Upload error:", error);
    },
  });

  const previewUrl = useMemo(() => {
    return value ? getUploadThingUrl(value) : undefined;
  }, [value]);

  const handleUpload = useCallback(
    async (files: File[]) => {
      if (disabled || !files.length) return;

      setIsUploading(true);
      setUploadError(undefined);

      try {
        await startUpload(files);
      } catch (error) {
        setIsUploading(false);
        setUploadError(
          error instanceof Error ? error.message : t("uploadFailed"),
        );
      }
    },
    [disabled, startUpload, t],
  );

  const handleRemove = useCallback(() => {
    if (disabled) return;
    onChange("");
    setUploadError(undefined);
  }, [disabled, onChange]);

  const onFileSelect = useCallback(
    (files: FileList | null) => {
      if (files && files.length > 0) {
        handleUpload(Array.from(files));
      }
    },
    [handleUpload],
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled && !isUploading) {
        setIsDragOver(true);
      }
    },
    [disabled, isUploading],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (disabled || isUploading) return;

      const files = e.dataTransfer.files;
      onFileSelect(files);
    },
    [disabled, isUploading, onFileSelect],
  );

  return {
    t,
    isUploading,
    uploadError,
    previewUrl,
    isDragOver,
    fileInputRef,
    handleUpload,
    handleRemove,
    onFileSelect,
    handleClick,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};
