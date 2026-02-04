import { gql } from "@apollo/client";

export const GET_CUSTOMER = gql`
  query customer {
    customer {
      email
      firstname
      lastname
      middlename
      custom_attributes {
        code
        ... on AttributeValue {
          value
        }
      }
    }
  }
`;
