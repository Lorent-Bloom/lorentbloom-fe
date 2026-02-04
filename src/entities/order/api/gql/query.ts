import { gql } from "@apollo/client";

export const GET_CUSTOMER_ORDERS = gql`
  query GetCustomerOrders {
    customer {
      orders {
        items {
          id
          order_number
          created_at
          grand_total
          status
          items {
            product_name
            quantity_ordered
            rent_from_date
            rent_to_date
          }
        }
      }
    }
  }
`;
