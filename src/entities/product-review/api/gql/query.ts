import { gql } from "@apollo/client";

export const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($sku: String!, $pageSize: Int, $currentPage: Int) {
    products(filter: { sku: { eq: $sku } }) {
      items {
        reviews(pageSize: $pageSize, currentPage: $currentPage) {
          items {
            average_rating
            nickname
            summary
            text
            created_at
            ratings_breakdown {
              name
              value
            }
          }
          page_info {
            current_page
            page_size
            total_pages
          }
        }
      }
    }
  }
`;

export const GET_RECENT_REVIEWS = gql`
  query GetRecentReviews($pageSize: Int) {
    products(pageSize: $pageSize, filter: {}) {
      items {
        name
        reviews(pageSize: 3) {
          items {
            average_rating
            nickname
            summary
            text
            created_at
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_REVIEW_RATINGS_METADATA = gql`
  query GetProductReviewRatingsMetadata {
    productReviewRatingsMetadata {
      items {
        id
        name
        values {
          value_id
          value
        }
      }
    }
  }
`;
