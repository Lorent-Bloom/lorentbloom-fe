// Product Review entity types based on Adobe Commerce/Magento GraphQL API

export interface ProductReviewRating {
  id: string;
  name: string;
  value: string;
}

export interface ProductReview {
  average_rating: number;
  nickname: string;
  summary: string;
  text: string;
  created_at: string;
  ratings_breakdown: ProductReviewRating[];
}

export interface ProductReviews {
  items: ProductReview[];
  page_info: {
    current_page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface ProductReviewRatingMetadata {
  id: string;
  name: string;
  values: Array<{
    value: string;
    value_id: string;
  }>;
}

// Input types for creating reviews
export interface ProductReviewRatingInput {
  id: string;
  value_id: string;
}

export interface CreateProductReviewInput {
  sku: string;
  nickname: string;
  summary: string;
  text: string;
  ratings: ProductReviewRatingInput[];
}

export interface CreateProductReviewOutput {
  review: {
    nickname: string;
    summary: string;
    text: string;
    average_rating: number;
    ratings_breakdown: ProductReviewRating[];
  };
}
