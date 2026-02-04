"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { RentedProductsTableProps } from "../model/interface";
import { createColumns } from "../model/columns";

export const useRentedProductsTable = ({
  initialData,
  locale,
}: RentedProductsTableProps) => {
  const t = useTranslations("rented-products-table");
  const router = useRouter();
  const [data] = useState(initialData.items);

  const columns = useMemo(() => createColumns(t, locale), [t, locale]);

  // eslint-disable-next-line
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: initialData.page_info.total_pages,
  });

  const handleRowClick = (productUrlKey: string) => {
    router.push(`/${locale}/products/p/${productUrlKey}`);
  };

  const handlePageChange = (page: number) => {
    window.location.href = `/${locale}/rented-products?page=${page}`;
  };

  return {
    table,
    flexRender,
    pageInfo: initialData.page_info,
    totalCount: initialData.total_count,
    handleRowClick,
    handlePageChange,
    t,
  };
};
