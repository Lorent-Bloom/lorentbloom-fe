// Public API exports for product-review entity
export {
  createProductReview,
  getProductReviews,
  getProductReviewRatingsMetadata,
} from "./api/action/client";
export { getRecentReviews } from "./api/action/server";
export type { ReviewWithProduct } from "./api/action/server";
export type {
  ProductReview,
  ProductReviews,
  ProductReviewRating,
  ProductReviewRatingMetadata,
  CreateProductReviewInput,
  ProductReviewRatingInput,
} from "./api/model/entity";
