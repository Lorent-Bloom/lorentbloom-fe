import { gql } from "@apollo/client";

export const GET_MY_PRODUCTS_RENTALS = gql`
  query GetMyProductsRentals(
    $pageSize: Int
    $currentPage: Int
    $filter: MyProductsRentalsFilterInput
  ) {
    myProductsRentals(
      pageSize: $pageSize
      currentPage: $currentPage
      filter: $filter
    ) {
      total_count
      items {
        reservation_id
        rent_from_date
        rent_to_date
        created_at
        product {
          sku
          name
        }
        order {
          order_id
          increment_id
        }
      }
      page_info {
        current_page
        page_size
        total_pages
      }
    }
  }
`;
