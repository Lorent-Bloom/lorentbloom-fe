import { gql } from "@apollo/client";

// TODO: Replace with actual GraphQL query when backend implements rented products
export const GET_RENTED_PRODUCTS = gql`
  query GetRentedProducts($pageSize: Int, $currentPage: Int) {
    customer {
      rented_products(pageSize: $pageSize, currentPage: $currentPage) {
        items {
          id
          product_id
          product_sku
          product_name
          product_image_url
          product_url_key
          rental_start_date
          rental_end_date
          quantity
          price_per_day
          total_price
          status
          created_at
          updated_at
        }
        page_info {
          current_page
          page_size
          total_pages
        }
        total_count
      }
    }
  }
`;

export const GET_RENTED_PRODUCT = gql`
  query GetRentedProduct($id: ID!) {
    customer {
      rented_product(id: $id) {
        id
        product_id
        product_sku
        product_name
        product_image_url
        product_url_key
        rental_start_date
        rental_end_date
        quantity
        price_per_day
        total_price
        status
        created_at
        updated_at
      }
    }
  }
`;
