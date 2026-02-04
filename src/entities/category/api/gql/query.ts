import { gql } from "@apollo/client";

/**
 * GraphQL queries for category operations
 */

export const GET_CATEGORY_TREE = gql`
  query GetCategoryTree($filters: CategoryFilterInput) {
    categoryList(filters: $filters) {
      uid
      id
      level
      name
      path
      url_path
      url_key
      image
      description
      children_count
      product_count
      children {
        uid
        id
        level
        name
        path
        url_path
        url_key
        image
        description
        children_count
        product_count
        children {
          uid
          id
          level
          name
          path
          url_path
          url_key
          image
          description
          children_count
          product_count
          children {
            uid
            id
            level
            name
            path
            url_path
            url_key
            image
            description
            children_count
            product_count
          }
        }
      }
    }
  }
`;
