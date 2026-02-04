import type { Product } from "@entities/product";

export interface FeaturedProductsProps {
  products: Product[];
  className?: string;
}
