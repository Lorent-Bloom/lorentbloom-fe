import { gql } from "@apollo/client";

export const CREATE_PRODUCT_RESERVATION = gql`
  mutation CreateProductReservation($input: CreateProductReservationInput!) {
    createProductReservation(input: $input) {
      reservation {
        product_id
        from_date
        to_date
      }
    }
  }
`;
