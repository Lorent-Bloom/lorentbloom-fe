import { useTranslations } from "next-intl";
import type { Product } from "@entities/product";

export interface UseProductGridProps {
  products: Product[];
}

export const useProductGrid = ({ products }: UseProductGridProps) => {
  const t = useTranslations("product-grid");

  return {
    t,
    hasProducts: products.length > 0,
  };
};
