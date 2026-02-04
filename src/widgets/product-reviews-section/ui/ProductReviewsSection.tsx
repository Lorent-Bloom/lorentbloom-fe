"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@shared/lib/utils";
import { WriteReviewForm } from "@features/write-review";
import { ReviewList } from "@widgets/review-list";
import { useProductReviewsSection } from "../lib/useProductReviewsSection";
import type { ProductReviewsSectionProps } from "../model/interface";

export default function ProductReviewsSection({
  productSku,
  className,
}: ProductReviewsSectionProps) {
  const { refreshTrigger, handleReviewSubmitted } = useProductReviewsSection();
  const t = useTranslations("product-reviews-section");

  return (
    <section className={cn("w-full", className)}>
      <div className="container py-12">
        <h2 className="text-center text-3xl font-bold tracking-tight mb-12">
          {t("reviews")}
        </h2>

        {/* Two column layout: Review list (left) | Write review form (right) */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* Left column: Review list */}
          <div>
            <ReviewList
              productSku={productSku}
              refreshTrigger={refreshTrigger}
            />
          </div>

          {/* Right column: Write review form */}
          <div className="rounded-lg border bg-card p-6 lg:sticky lg:top-24">
            <WriteReviewForm
              productSku={productSku}
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
