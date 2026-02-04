"use server";

import { getClient } from "@shared/api";
import { GET_PRODUCTS, GET_PRODUCT_DETAIL } from "../gql/query";
import type {
  GetProductsInput,
  GetProductsResponse,
  GetProductDetailResponse,
} from "../model/action";

export async function getProducts(input: GetProductsInput = {}) {
  try {
    const { search, filter, pageSize = 12, currentPage = 1, sort } = input;

    // Ensure at least search or filter is provided (API requirement)
    // If neither is provided, use an empty filter object
    const finalFilter = filter || (search ? undefined : {});

    const result = await getClient().query<GetProductsResponse>({
      query: GET_PRODUCTS,
      variables: {
        search: search || undefined,
        filter: finalFilter,
        pageSize,
        currentPage,
        sort,
      },
      context: {
        fetchOptions: {
          cache: "no-store",
        },
      },
    });

    if (result.error) {
      console.error("Error fetching products:", result.error);
      return {
        success: false,
        error: result.error.message,
        data: null,
      };
    }

    return {
      success: true,
      error: null,
      data: result.data?.products ?? null,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "PRODUCTS_FETCH_FAILED",
      data: null,
    };
  }
}

export async function getProductDetail(urlKey: string) {
  try {
    const result = await getClient().query<GetProductDetailResponse>({
      query: GET_PRODUCT_DETAIL,
      variables: {
        urlKey,
      },
      context: {
        fetchOptions: {
          cache: "no-store", // Temporarily disabled cache to see fresh data
          // TODO: Re-enable caching with proper revalidation strategy
          // cache: "force-cache",
          // next: {
          //   tags: [`product-${urlKey}`],
          // },
        },
      },
    });

    if (result.error || !result.data) {
      console.error("Error fetching product detail:", result.error);
      return {
        success: false,
        error: result.error?.message ?? "PRODUCT_FETCH_FAILED",
        data: null,
      };
    }

    const product = result.data.products.items[0];

    if (!product) {
      return {
        success: false,
        error: "PRODUCT_NOT_FOUND",
        data: null,
      };
    }

    return {
      success: true,
      error: null,
      data: product,
    };
  } catch (error) {
    console.error("Error fetching product detail:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "PRODUCT_DETAIL_FETCH_FAILED",
      data: null,
    };
  }
}
