import type { MediaGalleryEntry } from "@entities/product";

export interface ProductGalleryProps {
  images: MediaGalleryEntry[];
  productName: string;
  className?: string;
}
