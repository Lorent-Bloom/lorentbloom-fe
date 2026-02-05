import React from "react";
import { setRequestLocale } from "next-intl/server";
import { HomeHero } from "@widgets/home-hero";
import { HowItWorks } from "@widgets/how-it-works";
import { ItemUsageStatistics } from "@widgets/item-usage-statistics";
import { CategoryShowcase } from "@widgets/category-showcase";
import { FeaturedProducts } from "@widgets/featured-products";
import { Testimonials } from "@widgets/testimonials";
import { HomeCTA } from "@widgets/home-cta";
import { getCategoryTree } from "@entities/category";
import { getRecentReviews } from "@entities/product-review";
import { getPublicClient } from "@shared/api";
import { GET_PRODUCTS } from "@entities/product/api/gql/query";
import type { GetProductsResponse } from "@entities/product";
import { HomePageProps } from "../model/interface";

// Helper to count all categories in the tree
const countCategories = (categories: { children?: unknown[] }[]): number => {
  let count = 0;
  for (const cat of categories) {
    count += 1;
    if (cat.children && Array.isArray(cat.children)) {
      count += countCategories(cat.children as { children?: unknown[] }[]);
    }
  }
  return count;
};

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
  const totalProductsCount = productsResult.data?.products?.total_count ?? 0;
  const totalCategoriesCount = countCategories(categories);

  // Calculate review stats for hero section
  const totalReviews = reviews.length;
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.average_rating, 0) / reviews.length
      : 0;

  return (
    <div className="w-full">
      {/* Hero Section - Full viewport */}
      <HomeHero
        stats={{
          totalProducts: totalProductsCount,
          totalReviews,
          averageRating,
        }}
      />

      {/* How It Works - Simple 3-step process */}
      <HowItWorks />

      {/* Item Usage Statistics - The problem we solve */}
      <ItemUsageStatistics />

      {/* Featured Products Carousel */}
      <FeaturedProducts products={products} />

      {/* Category Showcase - Browse by category */}
      <CategoryShowcase categories={categories} />

      {/* Testimonials & Stats - Social proof */}
      <Testimonials
        stats={{
          productsCount: totalProductsCount,
          categoriesCount: totalCategoriesCount,
          ordersCount: 0, // TODO: Replace with real total orders count when API is available
          usersCount: 0, // TODO: Replace with real users count when API is available
        }}
        reviews={reviews}
      />

      {/* Final CTA - Conversion focused */}
      <HomeCTA />
    </div>
  );
};

export default HomePage;
