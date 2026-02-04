import { useTranslations } from "next-intl";
import type { Product } from "@entities/product";

export interface UseRelatedProductsProps {
  products: Product[];
  title?: string;
}

export const useRelatedProducts = ({
  products,
  title,
}: UseRelatedProductsProps) => {
  const t = useTranslations("related-products");

  const hasProducts = products && products.length > 0;
  const displayTitle = title || t("title");

  return {
    hasProducts,
    displayTitle,
  };
};
