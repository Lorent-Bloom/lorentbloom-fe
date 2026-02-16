import React from "react";
import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import { HomeHero } from "@widgets/home-hero";
import { getCategoryTree } from "@entities/category";

// Lazy-load below-fold widgets to reduce initial JS bundle
const HowItWorks = dynamic(() =>
  import("@widgets/how-it-works").then((mod) => ({ default: mod.HowItWorks })),
);
const ItemUsageStatistics = dynamic(() =>
  import("@widgets/item-usage-statistics").then((mod) => ({
    default: mod.ItemUsageStatistics,
  })),
);
const FeaturedProducts = dynamic(() =>
  import("@widgets/featured-products").then((mod) => ({
    default: mod.FeaturedProducts,
  })),
);
const CategoryShowcase = dynamic(() =>
  import("@widgets/category-showcase").then((mod) => ({
    default: mod.CategoryShowcase,
  })),
);
const RentalInfo = dynamic(() =>
  import("@widgets/rental-info").then((mod) => ({
    default: mod.RentalInfo,
  })),
);
const Testimonials = dynamic(() =>
  import("@widgets/testimonials").then((mod) => ({
    default: mod.Testimonials,
  })),
);
const HomeCTA = dynamic(() =>
  import("@widgets/home-cta").then((mod) => ({ default: mod.HomeCTA })),
);
import { getRecentReviews } from "@entities/product-review";
import { getPublicClient } from "@shared/api";
import { GET_PRODUCTS } from "@entities/product/api/gql/query";
import type { GetProductsResponse } from "@entities/product";
import { HomePageProps } from "../model/interface";

const HomePage = async ({ params }: HomePageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch categories, products, and reviews in parallel
  const [categoriesResult, productsResult, reviewsResult] = await Promise.all([
    getCategoryTree(),
    getPublicClient().query<GetProductsResponse>({
      query: GET_PRODUCTS,
      variables: {
        pageSize: 8,
        currentPage: 1,
        filter: {},
      },
      context: {
        fetchOptions: {
          next: { revalidate: 3600 },
        },
      },
    }),
    getRecentReviews(6), // Fetch 6 recent reviews for testimonials (2 rows)
  ]);

  const categories = categoriesResult.success
    ? (categoriesResult.data ?? [])
    : [];
  const products = productsResult.data?.products?.items ?? [];
  const reviews = reviewsResult.success ? (reviewsResult.data ?? []) : [];
  return (
    <div className="w-full">
      {/* Hero Section - Full viewport */}
      <HomeHero />

      {/* How It Works - Simple 3-step process */}
      <HowItWorks />

      {/* Item Usage Statistics - The problem we solve */}
      <ItemUsageStatistics />

      {/* Featured Products Carousel */}
      <FeaturedProducts products={products} />

      {/* Category Showcase - Browse by category */}
      <CategoryShowcase categories={categories} />

      {/* Rental Info - Value proposition */}
      <RentalInfo />

      {/* Testimonials - Social proof */}
      <Testimonials reviews={reviews} />

      {/* Final CTA - Conversion focused */}
      <HomeCTA />
    </div>
  );
};

export default HomePage;
