"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@shared/ui";
import { cn } from "@shared/lib/utils";
import { useProductGallery } from "../lib/useProductGallery";
import type { ProductGalleryProps } from "../model/interface";

export function ProductGallery({
  images,
  productName,
  className,
}: ProductGalleryProps) {
  const {
    setApi,
    current,
    activeImages,
    hasImages,
    hasMultipleImages,
    handleThumbnailClick,
  } = useProductGallery({ images });
  const t = useTranslations("product-gallery");

  if (!hasImages) {
    return (
      <div
        className={cn(
          "flex aspect-square items-center justify-center rounded-lg bg-muted",
          className,
        )}
      >
        <p className="text-sm text-muted-foreground">
          {t("noImagesAvailable")}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Main carousel */}
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {activeImages.map((image, index) => (
            <CarouselItem key={`${image.url}-${index}`}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                <Image
                  src={image.url}
                  alt={image.label || productName}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  priority={image.position === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {hasMultipleImages && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>

      {/* Thumbnail navigation */}
      {hasMultipleImages && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {activeImages.map((image, index) => (
            <button
              key={`thumb-${image.url}-${index}`}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all",
                current === index
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground/50",
              )}
            >
              <Image
                src={image.url}
                alt={image.label || `${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
