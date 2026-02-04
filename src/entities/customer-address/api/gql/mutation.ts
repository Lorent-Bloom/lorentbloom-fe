import { gql } from "@apollo/client";

export const CREATE_CUSTOMER_ADDRESS = gql`
  mutation CreateCustomerAddress($input: CustomerAddressInput!) {
    createCustomerAddress(input: $input) {
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
`;

export const UPDATE_CUSTOMER_ADDRESS = gql`
  mutation UpdateCustomerAddress($id: Int!, $input: CustomerAddressInput) {
    updateCustomerAddress(id: $id, input: $input) {
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
`;

export const DELETE_CUSTOMER_ADDRESS = gql`
  mutation DeleteCustomerAddress($id: Int!) {
    deleteCustomerAddress(id: $id)
  }
`;
