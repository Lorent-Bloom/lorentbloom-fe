import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts(
    $search: String
    $filter: ProductAttributeFilterInput
    $pageSize: Int
    $currentPage: Int
    $sort: ProductAttributeSortInput
  ) {
    products(
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
        url_key
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
            discount {
              amount_off
              percent_off
            }
          }
          maximum_price {
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
        image {
          url
          label
        }
        small_image {
          url
          label
        }
        thumbnail {
          url
          label
        }
        short_description {
          html
        }
        city
        city_name
        reservations {
          from_date
          to_date
        }
        rental_quantity
        customer {
          id
          email
          firstname
          lastname
        }
        ... on ConfigurableProduct {
          configurable_options {
            uid
            attribute_code
            label
            values {
              uid
              label
              value_index
            }
          }
          variants {
            attributes {
              code
              value_index
            }
            product {
              uid
              sku
              name
              stock_status
            }
          }
        }
        __typename
      }
      page_info {
        current_page
        page_size
        total_pages
      }
      total_count
      aggregations {
        attribute_code
        label
        count
        options {
          label
          value
          count
        }
      }
    }
  }
`;

export const GET_PRODUCT_DETAIL = gql`
  query GetProductDetail($urlKey: String!) {
    products(filter: { url_key: { eq: $urlKey } }) {
      items {
        id
        uid
        sku
        name
        url_key
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
            discount {
              amount_off
              percent_off
            }
          }
          maximum_price {
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
        image {
          url
          label
        }
        small_image {
          url
          label
        }
        thumbnail {
          url
          label
        }
        short_description {
          html
        }
        description {
          html
        }
        city
        city_name
        media_gallery {
          url
          label
          position
          disabled
        }
        rating_summary
        review_count
        stock_status
        rental_quantity
        only_x_left_in_stock
        manufacturer
        meta_description
        meta_keyword
        reservations {
          from_date
          to_date
        }
        customer {
          id
          email
          firstname
          lastname
        }
        related_products {
          id
          uid
          sku
          name
          url_key
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
              discount {
                amount_off
                percent_off
              }
            }
          }
          image {
            url
            label
          }
          small_image {
            url
            label
          }
        }
        upsell_products {
          id
          uid
          sku
          name
          url_key
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
              discount {
                amount_off
                percent_off
              }
            }
          }
          image {
            url
            label
          }
          small_image {
            url
            label
          }
        }
        ... on ConfigurableProduct {
          configurable_options {
            uid
            attribute_code
            label
            values {
              uid
              label
              value_index
            }
          }
          variants {
            attributes {
              code
              value_index
            }
            product {
              uid
              sku
              name
              stock_status
            }
          }
        }
        __typename
      }
    }
  }
`;
