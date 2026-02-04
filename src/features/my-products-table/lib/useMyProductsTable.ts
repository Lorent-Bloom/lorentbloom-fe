"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { MyProductsTableProps } from "../model/interface";
import { createColumns } from "../model/columns";

export const useMyProductsTable = ({
  initialData,
  locale,
  includeDisabled,
  onEdit,
  onIncludeDisabledChange,
}: MyProductsTableProps) => {
  const t = useTranslations("my-products-table");
  const router = useRouter();
  const searchParams = useSearchParams();
  // Use initialData.items directly, not state - it updates on navigation
  const data = initialData.items;
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const isFirstRender = useRef(true);

  const columns = useMemo(
    () => createColumns(t as (key: string) => string, locale, onEdit),
    [t, locale, onEdit],
  );

  // eslint-disable-next-line
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: initialData.page_info.total_pages,
  });

  // Debounce search - only trigger on actual search query changes
  useEffect(() => {
    // Skip on first render to avoid interfering with initial page load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const currentSearch = searchParams.get("search") || "";

    // Only navigate if search query actually changed from URL
    if (searchQuery === currentSearch) {
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.set("search", searchQuery);
      }
      params.set("page", "1"); // Reset to first page on search

      const newUrl = `/${locale}/account/my-products?${params.toString()}`;
      router.push(newUrl);
      router.refresh(); // Trigger server-side re-fetch
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, locale, router, searchParams]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return {
    table,
    flexRender,
    pageInfo: initialData.page_info,
    totalCount: initialData.total_count,
    searchQuery,
    handleSearchChange,
    includeDisabled,
    onIncludeDisabledChange,
    t,
  };
};
