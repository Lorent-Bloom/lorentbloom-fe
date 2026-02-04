"use client";

import Image from "next/image";
import { Upload, X, Star } from "lucide-react";
import { cn } from "@shared/lib/utils";
import { Button } from "@shared/ui/button";
import { useMultiImageUpload } from "../lib/useMultiImageUpload";
import type { MultiImageUploadProps } from "../model/interface";

export default function MultiImageUpload(props: MultiImageUploadProps) {
  const {
    images,
    handleRemove,
    handleSetMain,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleImageDragStart,
    handleImageDragOver,
    handleImageDrop,
    handleImageDragEnd,
    isDragOver,
    uploadingIds,
    draggedIndex,
    t,
  } = useMultiImageUpload(props);

  return (
    <div className="space-y-4">
      {/* Drag-n-drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-lg border-2 border-dashed p-8 text-center transition-colors",
          isDragOver
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          props.disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <input
          type="file"
          multiple
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileInputChange}
          disabled={props.disabled}
          className="absolute inset-0 cursor-pointer opacity-0"
          id="image-upload"
        />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm font-medium">{t("uploadImages")}</p>
          <p className="text-xs text-muted-foreground">{t("dragDropImages")}</p>
        </div>
      </div>

      {/* Error message */}
      {props.error && <p className="text-sm text-destructive">{props.error}</p>}

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              draggable={!props.disabled && !uploadingIds.includes(image.id)}
              onDragStart={() => handleImageDragStart(index)}
              onDragOver={(e) => handleImageDragOver(e, index)}
              onDrop={(e) => handleImageDrop(e, index)}
              onDragEnd={handleImageDragEnd}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                image.is_main
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "border-border",
                draggedIndex === index && "opacity-50 scale-95",
                !props.disabled &&
                  !uploadingIds.includes(image.id) &&
                  "cursor-move",
              )}
            >
              {/* Image preview */}
              <Image
                src={image.preview}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover pointer-events-none"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />

              {/* Loading overlay */}
              {uploadingIds.includes(image.id) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <p className="text-sm text-white">{t("uploadingImage")}</p>
                </div>
              )}

              {/* Controls overlay */}
              {!props.disabled && !uploadingIds.includes(image.id) && (
                <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/40">
                  {/* Top controls - Star (Main) and Remove */}
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      type="button"
                      size="icon"
                      variant={image.is_main ? "default" : "secondary"}
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetMain(image.id);
                      }}
                      title={t("setAsMain")}
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          image.is_main && "fill-current",
                        )}
                      />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(image.id);
                      }}
                      title={t("removeImage")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Main image indicator (always visible) */}
              {image.is_main && (
                <div className="absolute bottom-2 left-2 rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow-lg">
                  {t("mainImage")}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
