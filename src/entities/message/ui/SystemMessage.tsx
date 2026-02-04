"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { CheckCircle2, X } from "lucide-react";
import { format } from "date-fns";
import { getUploadThingUrl } from "@shared/api/uploadthing/client";
import type { SystemMessageProps } from "../model/interface";

export function SystemMessage({ message, stepName }: SystemMessageProps) {
  const t = useTranslations("message");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const displayName = stepName || t("systemUpdate");
  const hasImages = message.image_keys && message.image_keys.length > 0;

  return (
    <div className="flex flex-col items-center my-4 gap-2">
      {/* Step completion badge */}
      <div className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
        <span className="text-xs text-muted-foreground">{displayName}</span>
        <span className="text-xs text-muted-foreground">
          {format(new Date(message.created_at), "MMM d, HH:mm")}
        </span>
      </div>

      {/* Attached images */}
      {hasImages && (
        <div className="flex gap-2 flex-wrap justify-center max-w-md">
          {message.image_keys!.map((key, index) => (
            <button
              key={key}
              onClick={() => setLightboxImage(key)}
              className="relative h-20 w-20 rounded-lg overflow-hidden border hover:opacity-90 transition-opacity"
            >
              <Image
                src={getUploadThingUrl(key)}
                alt={`${displayName} - ${t("image")} ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Image
              src={getUploadThingUrl(lightboxImage)}
              alt={displayName}
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
