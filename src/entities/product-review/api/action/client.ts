import type { CreateProductReviewInput } from "../model/entity";
import {
  createProductReview as createProductReviewServer,
  getProductReviews as getProductReviewsServer,
  getProductReviewRatingsMetadata as getProductReviewRatingsMetadataServer,
} from "./server";

export async function createProductReview(input: CreateProductReviewInput) {
  return await createProductReviewServer(input);
}

export async function getProductReviews(
  sku: string,
  pageSize?: number,
  currentPage?: number,
) {
  return await getProductReviewsServer(sku, pageSize, currentPage);
}

export async function getProductReviewRatingsMetadata() {
  return await getProductReviewRatingsMetadataServer();
}
