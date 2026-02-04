import { gql } from "@apollo/client";

export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer(
    $email: String!
    $password: String!
    $firstname: String!
    $lastname: String!
    $middlename: String
  ) {
    createCustomer(
      input: {
        email: $email
        password: $password
        firstname: $firstname
        lastname: $lastname
        middlename: $middlename
      }
    ) {
      customer {
        id
        email
        firstname
        lastname
        middlename
      }
    }
  }
`;

export const GENERATE_CUSTOMER_TOKEN = gql`
  mutation generateCustomerToken($email: String!, $password: String!) {
    generateCustomerToken(email: $email, password: $password) {
      token
    }
  }
`;

export const UPDATE_CUSTOMER_V2 = gql`
  mutation UpdateCustomerV2($input: CustomerUpdateInput!) {
    updateCustomerV2(input: $input) {
      customer {
        firstname
        lastname
        middlename
        email
        custom_attributes {
          code
          ... on AttributeValue {
            value
          }
        }
      }
    }
  }
`;

export const UPDATE_CUSTOMER_EMAIL = gql`
  mutation UpdateCustomerEmail($email: String!, $password: String!) {
    updateCustomerEmail(email: $email, password: $password) {
      customer {
        email
        firstname
        lastname
      }
    }
  }
`;

export const CHANGE_CUSTOMER_PASSWORD = gql`
  mutation ChangeCustomerPassword(
    $currentPassword: String!
    $newPassword: String!
  ) {
    changeCustomerPassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      email
    }
  }
`;

export const UPDATE_CUSTOMER_ATTRIBUTES = gql`
  mutation UpdateCustomerAttributes($input: CustomerUpdateInput!) {
    updateCustomerV2(input: $input) {
      customer {
        firstname
        lastname
        email
        custom_attributes {
          code
          ... on AttributeValue {
            value
          }
        }
      }
    }
  }
`;

export const CONFIRM_EMAIL = gql`
  mutation ConfirmEmail($input: ConfirmEmailInput!) {
    confirmEmail(input: $input) {
      customer {
        email
        firstname
        lastname
      }
    }
  }
`;
