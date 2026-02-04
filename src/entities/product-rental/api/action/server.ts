"use server";

import { getClient } from "@shared/api";
import { isAuthError } from "@shared/lib/utils";
import { GET_MY_PRODUCTS_RENTALS } from "../gql/query";
import type { MyProductsRentalsResponse } from "../model/entity";
import type {
  GetMyProductsRentalsInput,
  GetMyProductsRentalsActionResponse,
} from "../model/action";

export async function getMyProductsRentals(
  input: GetMyProductsRentalsInput = {},
): Promise<GetMyProductsRentalsActionResponse> {
  try {
    const variables: {
      pageSize?: number;
      currentPage?: number;
      filter?: GetMyProductsRentalsInput["filter"];
    } = {};

    if (input.pageSize !== undefined) {
      variables.pageSize = input.pageSize;
    }
    if (input.currentPage !== undefined) {
      variables.currentPage = input.currentPage;
    }
    if (input.filter) {
      variables.filter = input.filter;
    }

    const { data } = await getClient().query<MyProductsRentalsResponse>({
      query: GET_MY_PRODUCTS_RENTALS,
      variables,
      fetchPolicy: "network-only",
    });

    if (!data?.myProductsRentals) {
      return {
        success: false,
        error: "RENTALS_FETCH_FAILED",
      };
    }

    return {
      success: true,
      data: {
        items: data.myProductsRentals.items,
        page_info: data.myProductsRentals.page_info,
        total_count: data.myProductsRentals.total_count,
      },
    };
  } catch (error) {
    if (isAuthError(error)) {
      return {
        success: false,
        error: "SESSION_EXPIRED",
      };
    }

    console.error("Failed to fetch product rentals:", error);
    return {
      success: false,
      error: "RENTALS_FETCH_FAILED",
    };
  }
}
