import type { Product } from "@entities/product";

export interface ProductGridProps {
  products: Product[];
  className?: string;
}

export interface ProductCardProps {
  product: Product;
}

export interface ProductGridSkeletonProps {
  count?: number;
}
