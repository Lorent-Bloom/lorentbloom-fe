"use client";

import { useTranslations } from "next-intl";
import { useUpdateSearchParams } from "@features/product-search";
import type { ProductsResult } from "@entities/product";

export interface UseProductsPageProps {
  data: ProductsResult | null;
  error: string | null;
}

export const useProductsPage = ({ data, error }: UseProductsPageProps) => {
  const t = useTranslations("products");
  const updateSearchParams = useUpdateSearchParams();

  const currentPage = data?.page_info.current_page || 1;
  const totalPages = data?.page_info.total_pages || 1;
  const totalCount = data?.total_count || 0;
  const pageSize = data?.page_info.page_size || 12;

  const handlePageChange = (page: number) => {
    updateSearchParams({ page: page === 1 ? null : page.toString() });
  };

  const handlePageSizeChange = (size: string) => {
    updateSearchParams({
      pageSize: size === "12" ? null : size,
      page: null, // Reset to page 1 when changing page size
    });
  };

  const start =
    data && data.items.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const end = data ? Math.min(currentPage * pageSize, totalCount) : 0;

  const hasData = !!data;
  const hasProducts = data ? data.items.length > 0 : false;
  const hasError = !!error;

  return {
    t,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    start,
    end,
    hasData,
    hasProducts,
    hasError,
  };
};
