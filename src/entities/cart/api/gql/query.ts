import { gql } from "@apollo/client";

export const GET_CUSTOMER_CART = gql`
  query GetCustomerCart {
    customerCart {
      id
      total_quantity
      items {
        id
        uid
        quantity
        rent_from_date
        rent_to_date
        rental_total
        product {
          sku
          name
          url_key
          thumbnail {
            url
            label
          }
          price_range {
            minimum_price {
              regular_price {
                value
                currency
              }
              final_price {
                value
                currency
              }
            }
          }
        }
        prices {
          row_total {
            value
            currency
          }
          row_total_including_tax {
            value
            currency
          }
          total_item_discount {
            value
            currency
          }
        }
      }
      prices {
        grand_total {
          value
          currency
        }
        subtotal_excluding_tax {
          value
          currency
        }
        subtotal_including_tax {
          value
          currency
        }
        rental_total {
          value
          currency
        }
        applied_taxes {
          amount {
            value
            currency
          }
          label
        }
      }
    }
  }
`;
