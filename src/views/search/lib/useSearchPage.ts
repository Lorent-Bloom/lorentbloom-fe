/**
 * Search View - Logic Hook
 */

"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ProductsResult as GetProductsResult } from "@entities/product";
import type { CategoryTree } from "@entities/category";

interface UseSearchPageProps {
  searchQuery: string;
  categoriesData: CategoryTree[];
  productsData: GetProductsResult | null;
  productsError: string | undefined;
  locale: string;
}

export function useSearchPage({
  searchQuery,
  categoriesData,
  productsData,
  productsError,
}: UseSearchPageProps) {
  const router = useRouter();
  const t = useTranslations("search");

  // Product data
  const products = productsData?.items || [];
  const totalCount = productsData?.total_count || 0;
  const currentPage = productsData?.page_info?.current_page || 1;
  const totalPages = productsData?.page_info?.total_pages || 1;
  const pageSize = productsData?.page_info?.page_size || 12;

  // Calculate display range
  const start = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const end = Math.min(currentPage * pageSize, totalCount);

  // State flags
  const hasProducts = products.length > 0;
  const hasCategories = categoriesData.length > 0;
  const hasResults = hasProducts || hasCategories;
  const hasError = !!productsError;

  // Pagination handler
  const handlePageChange = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", page.toString());
    router.push(url.pathname + url.search);
  };

  // Page size change handler
  const handlePageSizeChange = (newPageSize: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("pageSize", newPageSize);
    url.searchParams.set("page", "1"); // Reset to first page
    router.push(url.pathname + url.search);
  };

  // Truncate query for display if too long
  const displayQuery =
    searchQuery.length > 50 ? `${searchQuery.slice(0, 50)}...` : searchQuery;

  return {
    t,
    products,
    totalCount,
    currentPage,
    totalPages,
    pageSize,
    start,
    end,
    hasProducts,
    hasCategories,
    hasResults,
    hasError,
    displayQuery,
    handlePageChange,
    handlePageSizeChange,
  };
}
