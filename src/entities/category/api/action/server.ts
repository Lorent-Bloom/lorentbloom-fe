"use server";

import { getPublicClient } from "@shared/api";
import { GET_CATEGORY_TREE } from "../gql/query";
import type {
  GetCategoryTreeInput,
  GetCategoryTreeResponse,
  GetCategoryTreeResult,
} from "../model/action";

/**
 * Server action to fetch category tree from Magento GraphQL API
 * Uses public client (no auth) since categories are public data
 *
 * @param input - Optional filters for category query
 * @returns Category tree data or error
 */
export async function getCategoryTree(
  input?: GetCategoryTreeInput,
): Promise<GetCategoryTreeResult> {
  try {
    const { data } = await getPublicClient().query<GetCategoryTreeResponse>({
      query: GET_CATEGORY_TREE,
      variables: input || {},
      context: {
        fetchOptions: {
          // Cache category data for 1 hour (categories rarely change)
          next: { revalidate: 3600 },
        },
      },
    });

    if (!data?.categoryList) {
      return {
        success: false,
        error: "CATEGORIES_NOT_FOUND",
      };
    }

    return {
      success: true,
      data: data.categoryList,
    };
  } catch (error) {
    console.error("Error fetching category tree:", error);
    return {
      success: false,
      error: "CATEGORIES_FETCH_FAILED",
    };
  }
}
