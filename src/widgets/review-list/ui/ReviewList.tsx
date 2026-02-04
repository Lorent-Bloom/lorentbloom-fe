"use client";

import React from "react";
import { cn } from "@shared/lib/utils";
import { StarRating } from "@shared/ui";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { useReviewList } from "../lib/useReviewList";
import type { ReviewListProps } from "../model/interface";

export default function ReviewList({
  productSku,
  className,
  refreshTrigger,
}: ReviewListProps) {
  const t = useTranslations("review-list");
  const { reviews, isLoading, error, hasReviews } = useReviewList(
    productSku,
    refreshTrigger,
  );

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-center p-8", className)}>
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (!hasReviews) {
    return (
      <div className={cn("text-center p-8", className)}>
        <p className="text-sm text-muted-foreground">{t("noReviews")}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="text-xl font-semibold">{t("title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("totalReviews", { count: reviews!.items.length })}
        </p>
      </div>

      <div className="space-y-6">
        {reviews!.items.map((review, index) => (
          <div key={index} className="rounded-lg border bg-card p-6 space-y-3">
            {/* Rating and Name */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <StarRating rating={review.average_rating} size="sm" />
                  <span className="font-medium">{review.nickname}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Summary */}
            <h4 className="font-semibold">{review.summary}</h4>

            {/* Review Text */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {review.text}
            </p>

            {/* Individual Ratings Breakdown */}
            {review.ratings_breakdown &&
              review.ratings_breakdown.length > 0 && (
                <div className="pt-3 border-t space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t("ratingsBreakdown")}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {review.ratings_breakdown.map((rating, ratingIndex) => (
                      <div
                        key={ratingIndex}
                        className="flex items-center gap-2 text-xs"
                      >
                        <span className="text-muted-foreground">
                          {rating.name}:
                        </span>
                        <span className="font-medium">{rating.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
