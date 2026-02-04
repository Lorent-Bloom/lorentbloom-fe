import { gql } from "@apollo/client";

// For owner viewing their rental orders (products they listed that others rented)
export const GET_RENTAL_ORDER_DETAIL = gql`
  query GetRentalOrderDetail($orderNumber: String!) {
    myRentalOrders(filter: { number: { eq: $orderNumber } }) {
      items {
        id
        order_number
        created_at
        status
        carrier
        shipping_method
        customer_info {
          id
          email
          telephone
          firstname
          lastname
        }
        parent_customer_info {
          id
          email
          firstname
          lastname
          telephone
        }
        billing_address {
          firstname
          lastname
          company
          street
          city
          region
          postcode
          country_code
          telephone
        }
        shipping_address {
          firstname
          lastname
          company
          street
          city
          region
          postcode
          country_code
          telephone
        }
        payment_methods {
          name
          type
        }
        items {
          id
          product_name
          product_sku
          product_url_key
          quantity_ordered
          quantity_shipped
          quantity_invoiced
          quantity_refunded
          quantity_canceled
          status
          product_sale_price {
            value
            currency
          }
          selected_options {
            label
            value
          }
          discounts {
            amount {
              value
              currency
            }
            label
          }
          rent_from_date
          rent_to_date
        }
        total {
          subtotal {
            value
            currency
          }
          grand_total {
            value
            currency
          }
          total_shipping {
            value
            currency
          }
          total_tax {
            value
            currency
          }
          discounts {
            amount {
              value
              currency
            }
            label
          }
          taxes {
            amount {
              value
              currency
            }
            title
            rate
          }
        }
      }
    }
  }
`;

// For buyer viewing their own orders (products they rented from others)
export const GET_ORDER_DETAIL = gql`
  query GetOrderDetail($orderNumber: String!) {
    customer {
      orders(filter: { number: { eq: $orderNumber } }) {
        items {
          id
          number
          order_date
          status
          carrier
          shipping_method
          customer_info {
            id
            email
            telephone
            firstname
            lastname
          }
          parent_customer_info {
            id
            email
            firstname
            lastname
            telephone
          }
          billing_address {
            firstname
            lastname
            company
            street
            city
            region
            postcode
            country_code
            telephone
          }
          shipping_address {
            firstname
            lastname
            company
            street
            city
            region
            postcode
            country_code
            telephone
          }
          payment_methods {
            name
            type
          }
          items {
            id
            product_name
            product_sku
            product_url_key
            quantity_ordered
            quantity_shipped
            quantity_invoiced
            quantity_refunded
            quantity_canceled
            status
            product_sale_price {
              value
              currency
            }
            selected_options {
              label
              value
            }
            discounts {
              amount {
                value
                currency
              }
              label
            }
          }
          total {
            subtotal {
              value
              currency
            }
            grand_total {
              value
              currency
            }
            total_shipping {
              value
              currency
            }
            total_tax {
              value
              currency
            }
            discounts {
              amount {
                value
                currency
              }
              label
            }
            taxes {
              amount {
                value
                currency
              }
              title
              rate
            }
          }
        }
      }
    }
  }
`;
