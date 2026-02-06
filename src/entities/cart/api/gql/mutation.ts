import { gql } from "@apollo/client";

export const ADD_PRODUCTS_TO_CART = gql`
  mutation AddProductsToCart($cartId: String!, $cartItems: [CartItemInput!]!) {
    addProductsToCart(cartId: $cartId, cartItems: $cartItems) {
      cart {
        id
        total_quantity
        items {
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
        }
      }
      user_errors {
        code
        message
      }
    }
  }
`;

export const UPDATE_CART_ITEMS = gql`
  mutation UpdateCartItems(
    $cartId: String!
    $cartItems: [CartItemUpdateInput!]!
  ) {
    updateCartItems(input: { cart_id: $cartId, cart_items: $cartItems }) {
      cart {
        id
        total_quantity
        items {
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
        }
      }
    }
  }
`;

export const REMOVE_ITEM_FROM_CART = gql`
  mutation RemoveItemFromCart($cartId: String!, $cartItemUid: ID!) {
    removeItemFromCart(
      input: { cart_id: $cartId, cart_item_uid: $cartItemUid }
    ) {
      cart {
        id
        total_quantity
        items {
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
        }
      }
    }
  }
`;

export const SET_BILLING_ADDRESS_ON_CART = gql`
  mutation SetBillingAddressOnCart($cartId: String!, $customerAddressId: Int!) {
    setBillingAddressOnCart(
      input: {
        cart_id: $cartId
        billing_address: { customer_address_id: $customerAddressId }
      }
    ) {
      cart {
        billing_address {
          firstname
          lastname
          street
          city
          region {
            code
            label
          }
          postcode
          country {
            code
            label
          }
          telephone
        }
      }
    }
  }
`;

export const SET_SHIPPING_ADDRESSES_ON_CART = gql`
  mutation SetShippingAddressesOnCart(
    $cartId: String!
    $customerAddressId: Int!
  ) {
    setShippingAddressesOnCart(
      input: {
        cart_id: $cartId
        shipping_addresses: [{ customer_address_id: $customerAddressId }]
      }
    ) {
      cart {
        shipping_addresses {
          firstname
          lastname
          street
          city
          region {
            code
            label
          }
          postcode
          country {
            code
            label
          }
          telephone
          available_shipping_methods {
            carrier_code
            carrier_title
            method_code
            method_title
            amount {
              value
              currency
            }
          }
        }
      }
    }
  }
`;

export const SET_SHIPPING_METHOD_ON_CART = gql`
  mutation SetShippingMethodOnCart(
    $cartId: String!
    $carrierCode: String!
    $methodCode: String!
  ) {
    setShippingMethodsOnCart(
      input: {
        cart_id: $cartId
        shipping_methods: [
          { carrier_code: $carrierCode, method_code: $methodCode }
        ]
      }
    ) {
      cart {
        shipping_addresses {
          selected_shipping_method {
            carrier_code
            carrier_title
            method_code
            method_title
            amount {
              value
              currency
            }
          }
        }
      }
    }
  }
`;
