/**
 * Search View - Type Definitions
 */

import type { CategoryTree } from "@entities/category";
import type { ProductsResult as GetProductsResult } from "@entities/product";

export interface SearchPageProps {
  searchQuery: string;
  categoriesData: CategoryTree[];
  productsData: GetProductsResult | null;
  productsError: string | undefined;
  searchParams: {
    q?: string;
    page?: string;
    pageSize?: string;
    sort?: string;
    [key: string]: string | undefined;
  };
  locale: string;
}
