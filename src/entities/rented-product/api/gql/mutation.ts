import { gql } from "@apollo/client";

// TODO: Replace with actual GraphQL mutations when backend implements them
export const UPDATE_RENTAL = gql`
  mutation UpdateRental(
    $id: ID!
    $rental_start_date: String!
    $rental_end_date: String!
    $quantity: Int!
  ) {
    updateRental(
      input: {
        id: $id
        rental_start_date: $rental_start_date
        rental_end_date: $rental_end_date
        quantity: $quantity
      }
    ) {
      id
      rental_start_date
      rental_end_date
      quantity
      total_price
      updated_at
    }
  }
`;

export const CANCEL_RENTAL = gql`
  mutation CancelRental($id: ID!) {
    cancelRental(id: $id) {
      id
      status
      updated_at
    }
  }
`;
