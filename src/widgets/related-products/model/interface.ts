import type { Product } from "@entities/product";

export interface RelatedProductsProps {
  products: Product[];
  title?: string;
  className?: string;
}
