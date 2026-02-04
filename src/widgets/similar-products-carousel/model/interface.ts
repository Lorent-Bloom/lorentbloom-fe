import type { Product } from "@entities/product";

export interface SimilarProductsCarouselProps {
  products: Product[];
  title?: string;
  className?: string;
}
