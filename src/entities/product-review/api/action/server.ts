"use server";

import { getClient, getPublicClient } from "@shared/api";
import { CREATE_PRODUCT_REVIEW } from "../gql/mutation";
import {
  GET_PRODUCT_REVIEWS,
  GET_PRODUCT_REVIEW_RATINGS_METADATA,
  GET_RECENT_REVIEWS,
} from "../gql/query";
import type {
  CreateProductReviewInput,
  CreateProductReviewOutput,
  ProductReviews,
  ProductReviewRatingMetadata,
  ProductReview,
} from "../model/entity";

interface CreateReviewResponse {
  createProductReview: CreateProductReviewOutput;
}

interface GetReviewsResponse {
  products: {
    items: Array<{
      reviews: ProductReviews;
    }>;
  };
}

interface GetRatingsMetadataResponse {
  productReviewRatingsMetadata: {
    items: ProductReviewRatingMetadata[];
  };
}

export async function createProductReview(input: CreateProductReviewInput) {
  try {
    const { data } = await getClient().mutate<CreateReviewResponse>({
      mutation: CREATE_PRODUCT_REVIEW,
      variables: { input },
    });

    return {
      success: true,
      data: data?.createProductReview.review,
    };
  } catch (error) {
    console.error("Error creating product review:", error);
    return {
      success: false,
      error: "REVIEW_SUBMIT_FAILED",
    };
  }
}

export async function getProductReviews(
  sku: string,
  pageSize = 10,
  currentPage = 1,
) {
  try {
    const { data } = await getClient().query<GetReviewsResponse>({
      query: GET_PRODUCT_REVIEWS,
      variables: { sku, pageSize, currentPage },
      fetchPolicy: "network-only",
    });

    return {
      success: true,
      data: data?.products.items[0]?.reviews,
    };
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return {
      success: false,
      error: "REVIEWS_FETCH_FAILED",
    };
  }
}

export async function getProductReviewRatingsMetadata() {
  try {
    const { data } = await getClient().query<GetRatingsMetadataResponse>({
      query: GET_PRODUCT_REVIEW_RATINGS_METADATA,
      fetchPolicy: "cache-first",
    });

    return {
      success: true,
      data: data?.productReviewRatingsMetadata.items || [],
    };
  } catch (error) {
    console.error("Error fetching ratings metadata:", error);
    return {
      success: false,
      error: "RATINGS_METADATA_FETCH_FAILED",
    };
  }
}

export interface ReviewWithProduct extends ProductReview {
  productName: string;
}

interface GetRecentReviewsResponse {
  products: {
    items: Array<{
      name: string;
      reviews: {
        items: ProductReview[];
      };
    }>;
  };
}

/**
 * Fetch recent reviews across all products for the home page testimonials
 * Uses public client since reviews are public data
 */
export async function getRecentReviews(
  limit = 3,
): Promise<{ success: boolean; data?: ReviewWithProduct[]; error?: string }> {
  try {
    const { data } = await getPublicClient().query<GetRecentReviewsResponse>({
      query: GET_RECENT_REVIEWS,
      variables: { pageSize: 20 }, // Fetch from 20 products to find reviews
      context: {
        fetchOptions: {
          next: { revalidate: 3600 }, // Cache for 1 hour
        },
      },
    });

    // Collect all reviews with product names
    const allReviews: ReviewWithProduct[] = [];

    if (data?.products?.items) {
      for (const product of data.products.items) {
        if (product.reviews?.items) {
          for (const review of product.reviews.items) {
            allReviews.push({
              ...review,
              productName: product.name,
            });
          }
        }
      }
    }

    // Sort by date (newest first) and take the requested limit
    const sortedReviews = allReviews
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, limit);

    return {
      success: true,
      data: sortedReviews,
    };
  } catch (error) {
    console.error("Error fetching recent reviews:", error);
    return {
      success: false,
      error: "RECENT_REVIEWS_FETCH_FAILED",
    };
  }
}
