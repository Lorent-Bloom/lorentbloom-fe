"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { ReviewWithProduct } from "@entities/product-review";
import type { Testimonial, Stat, StatsData } from "../model/interface";

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${Math.floor(num / 1000)}k+`;
  }
  return num.toString();
};

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

export const useTestimonials = (
  statsData?: StatsData,
  reviews?: ReviewWithProduct[],
) => {
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

  // Use real stats if available, otherwise use translated fallback values
  const stats: Stat[] = statsData
    ? [
        {
          value: formatNumber(statsData.productsCount),
          label: t("stats.2.label"), // Products Available
        },
        {
          value: formatNumber(statsData.categoriesCount),
          label: t("stats.3.label"), // Categories
        },
        {
          value: formatNumber(statsData.ordersCount ?? 0),
          label: t("stats.4.label"), // Total Orders
        },
        {
          value: formatNumber(statsData.usersCount ?? 0),
          label: t("stats.5.label"), // Active Users
        },
      ]
    : [
        {
          value: t("stats.2.value"),
          label: t("stats.2.label"),
        },
        {
          value: t("stats.3.value"),
          label: t("stats.3.label"),
        },
        {
          value: t("stats.4.value"),
          label: t("stats.4.label"),
        },
        {
          value: t("stats.5.value"),
          label: t("stats.5.label"),
        },
      ];

  return {
    title: t("title"),
    subtitle: t("subtitle"),
    badge: t("badge"),
    testimonials,
    stats,
    statsTitle: t("statsTitle"),
    hasRealReviews: reviews && reviews.length > 0,
  };
};
