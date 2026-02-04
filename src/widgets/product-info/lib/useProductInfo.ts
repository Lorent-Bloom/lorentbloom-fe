"use client";

import { useTranslations } from "next-intl";
import type { ProductDetail } from "@entities/product";

interface UseProductInfoProps {
  product: ProductDetail;
}

export const useProductInfo = ({ product }: UseProductInfoProps) => {
  const t = useTranslations("product-info");

  const finalPrice = product.price_range.minimum_price.final_price;
  const regularPrice = product.price_range.minimum_price.regular_price;
  const hasDiscount = finalPrice && finalPrice.value < regularPrice.value;
  const discount = product.price_range.minimum_price.discount;

  return {
    t,
    finalPrice,
    regularPrice,
    hasDiscount,
    discount,
  };
};
