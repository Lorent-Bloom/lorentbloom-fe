import { gql } from "@apollo/client";

export const GET_CUSTOMER_PRODUCTS = gql`
  query GetCustomerProducts(
    $search: String
    $filter: ProductAttributeFilterInput
    $pageSize: Int = 20
    $currentPage: Int = 1
    $sort: ProductAttributeSortInput
  ) {
    myProducts(
      search: $search
      filter: $filter
      pageSize: $pageSize
      currentPage: $currentPage
      sort: $sort
    ) {
      items {
        id
        uid
        sku
        name
        is_active
        product_status
        short_description {
          html
        }
        description {
          html
        }
        manufacturer
        city
        city_name
        color
        categories {
          id
          uid
          name
          level
          path
        }
        new_category
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
          }
        }
        media_gallery {
          url
          label
          position
          disabled
        }
        image {
          url
          label
        }
        stock_status
        rental_quantity
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
`;

export const GET_CUSTOMER_PRODUCT = gql`
  query GetCustomerProduct($sku: String!) {
    products(filter: { sku: { eq: $sku } }) {
      items {
        id
        uid
        sku
        name
        is_active
        product_status
        short_description {
          html
        }
        description {
          html
        }
        manufacturer
        city
        city_name
        color
        categories {
          id
          uid
          name
          level
          path
        }
        new_category
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
          }
        }
        media_gallery {
          url
          label
          position
          disabled
        }
        image {
          url
          label
        }
        stock_status
        rental_quantity
        created_at
        updated_at
      }
    }
  }
`;
