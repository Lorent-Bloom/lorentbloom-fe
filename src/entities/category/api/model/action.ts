import type { CategoryFilterInput, CategoryTree } from "./entity";

/**
 * Server action response types
 */

export interface GetCategoryTreeResponse {
  categoryList: CategoryTree[];
}

export interface GetCategoryTreeInput {
  filters?: CategoryFilterInput;
}

export interface GetCategoryTreeResult {
  success: boolean;
  data?: CategoryTree[];
  error?: string;
}
