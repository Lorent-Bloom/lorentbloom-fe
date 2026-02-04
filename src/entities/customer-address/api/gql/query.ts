import { gql } from "@apollo/client";

export const GET_CUSTOMER_ADDRESSES = gql`
  query customerAddresses {
    customer {
      addresses {
        id
        firstname
        lastname
        company
        street
        city
        region {
          region
          region_code
        }
        postcode
        country_code
        telephone
        default_shipping
        default_billing
      }
    }
  }
`;
