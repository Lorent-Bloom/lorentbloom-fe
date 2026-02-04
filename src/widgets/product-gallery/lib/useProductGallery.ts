"use client";

import * as React from "react";
import type { CarouselApi } from "@shared/ui";
import type { MediaGalleryEntry } from "@entities/product";

export interface UseProductGalleryProps {
  images: MediaGalleryEntry[];
}

export const useProductGallery = ({ images }: UseProductGalleryProps) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const activeImages = images.filter((img) => !img.disabled && img.url);

  const hasImages = activeImages.length > 0;
  const hasMultipleImages = activeImages.length > 1;

  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index);
  };

  return {
    api,
    setApi,
    current,
    activeImages,
    hasImages,
    hasMultipleImages,
    handleThumbnailClick,
  };
};
