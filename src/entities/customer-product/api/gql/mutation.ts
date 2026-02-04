import { gql } from "@apollo/client";

// Matches exact backend createProduct mutation format
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      product {
        id
        uid
        sku
        name
        is_active
        product_status
        type_id
        stock_status
        rental_quantity
        created_at
        updated_at
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
      }
    }
  }
`;

// Matches exact backend updateProduct mutation format
export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      product {
        id
        uid
        sku
        name
        is_active
        product_status
        type_id
        stock_status
        rental_quantity
        created_at
        updated_at
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
      }
    }
  }
`;
