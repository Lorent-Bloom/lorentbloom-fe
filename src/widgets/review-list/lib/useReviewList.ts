"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  getProductReviews,
  type ProductReviews,
} from "@entities/product-review";

export function useReviewList(productSku: string, refreshTrigger?: number) {
  const t = useTranslations("review-list");
  const [reviews, setReviews] = useState<ProductReviews | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReviews() {
      setIsLoading(true);
      setError(null);

      const result = await getProductReviews(productSku);

      if (result.success && result.data) {
        setReviews(result.data);
      } else {
        setError(result.error || t("failedToLoad"));
      }

      setIsLoading(false);
    }

    loadReviews();
  }, [productSku, refreshTrigger, t]);

  const hasReviews = reviews && reviews.items.length > 0;

  return {
    reviews,
    isLoading,
    error,
    hasReviews,
  };
}
