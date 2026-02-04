"use client";

import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { useLogoUploader } from "../lib/useLogoUploader";
import type { LogoUploaderProps } from "../model/interface";

export default function LogoUploader({
  value,
  onChange,
  disabled,
  error,
}: LogoUploaderProps) {
  const {
    t,
    isUploading,
    uploadError,
    previewUrl,
    isDragOver,
    fileInputRef,
    handleRemove,
    onFileSelect,
    handleClick,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useLogoUploader({
    value,
    onChange,
    disabled,
  });

  const displayError = error || uploadError;

  if (previewUrl && !isUploading) {
    return (
      <div className="space-y-2">
        <div className="group relative w-full max-w-md rounded-lg border border-input bg-background p-6">
          <div className="relative h-48 w-full overflow-hidden rounded-md">
            <Image
              src={previewUrl}
              alt={t("fields.companyLogo")}
              fill
              className="object-contain"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="absolute right-3 top-3 rounded-full bg-background/80 p-2 opacity-0 backdrop-blur-sm transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={t("removeImage")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {displayError && (
          <p className="text-sm text-destructive">{displayError}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          flex min-h-[12rem] w-full cursor-pointer flex-col items-center justify-center
          rounded-lg border-2 border-dashed p-6 transition-colors
          ${isDragOver ? "border-primary bg-primary/5" : "border-input"}
          ${disabled ? "cursor-not-allowed opacity-50" : "hover:border-primary hover:bg-accent"}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={(e) => onFileSelect(e.target.files)}
          disabled={disabled || isUploading}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {t("uploadingImage")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{t("uploadLogo")}</p>
              <p className="text-xs text-muted-foreground">
                {t("dragDropHint")}
              </p>
            </div>
          </div>
        )}
      </div>

      {displayError && (
        <p className="text-sm text-destructive">{displayError}</p>
      )}
    </div>
  );
}
