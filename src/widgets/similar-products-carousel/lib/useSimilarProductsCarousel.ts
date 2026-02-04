import { useTranslations } from "next-intl";
import type { Product } from "@entities/product";

export interface UseSimilarProductsCarouselProps {
  products: Product[];
  title?: string;
}

export const useSimilarProductsCarousel = ({
  products,
  title,
}: UseSimilarProductsCarouselProps) => {
  const t = useTranslations("similar-products-carousel");

  const hasProducts = products && products.length > 0;
  const displayTitle = title || t("title");

  return {
    hasProducts,
    displayTitle,
  };
};
