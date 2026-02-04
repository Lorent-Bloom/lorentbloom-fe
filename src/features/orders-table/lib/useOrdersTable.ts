"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { OrdersTableProps } from "../model/interface";
import { createColumns } from "../model/columns";

export const useOrdersTable = ({ orders, locale }: OrdersTableProps) => {
  const t = useTranslations("orders-table");

  const columns = useMemo(() => createColumns(t, locale), [t, locale]);

  // eslint-disable-next-line
  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return {
    table,
    flexRender,
    totalCount: orders.length,
    t,
  };
};
