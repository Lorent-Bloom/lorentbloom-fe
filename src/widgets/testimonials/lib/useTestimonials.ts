"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { ReviewWithProduct } from "@entities/product-review";
import type { Testimonial } from "../model/interface";

// Convert API review to testimonial format
const reviewToTestimonial = (
  review: ReviewWithProduct,
  index: number,
): Testimonial => ({
  id: `review-${index}`,
  name: review.nickname,
  role: review.productName, // Show which product they reviewed
  content: review.text || review.summary,
  rating: Math.round(review.average_rating / 20), // Convert 0-100 to 0-5 stars
  avatar: review.nickname.charAt(0).toUpperCase(),
});

export const useTestimonials = (reviews?: ReviewWithProduct[]) => {
  const t = useTranslations("testimonials");

  // Use real reviews if available, otherwise use fallback translations
  const testimonials: Testimonial[] = useMemo(() => {
    if (reviews && reviews.length > 0) {
      return reviews.map((review, index) => reviewToTestimonial(review, index));
    }

    // Fallback to hardcoded testimonials from translations
    return [
      {
        id: "1",
        name: t("reviews.0.name"),
        role: t("reviews.0.role"),
        content: t("reviews.0.content"),
        rating: 5,
        avatar: "M",
      },
      {
        id: "2",
        name: t("reviews.1.name"),
        role: t("reviews.1.role"),
        content: t("reviews.1.content"),
        rating: 5,
        avatar: "S",
      },
      {
        id: "3",
        name: t("reviews.2.name"),
        role: t("reviews.2.role"),
        content: t("reviews.2.content"),
        rating: 5,
        avatar: "A",
      },
      {
        id: "4",
        name: t("reviews.3.name"),
        role: t("reviews.3.role"),
        content: t("reviews.3.content"),
        rating: 5,
        avatar: "E",
      },
      {
        id: "5",
        name: t("reviews.4.name"),
        role: t("reviews.4.role"),
        content: t("reviews.4.content"),
        rating: 5,
        avatar: "D",
      },
      {
        id: "6",
        name: t("reviews.5.name"),
        role: t("reviews.5.role"),
        content: t("reviews.5.content"),
        rating: 5,
        avatar: "L",
      },
    ];
  }, [reviews, t]);

  return {
    title: t("title"),
    subtitle: t("subtitle"),
    badge: t("badge"),
    testimonials,
    hasRealReviews: reviews && reviews.length > 0,
  };
};
