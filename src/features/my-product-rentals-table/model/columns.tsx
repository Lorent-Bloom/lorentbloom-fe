"use client";

import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import type { ProductRental } from "@entities/product-rental";

const columnHelper = createColumnHelper<ProductRental>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createColumns = (t: any, locale: string) => [
  columnHelper.accessor((row) => row.product?.sku, {
    id: "productSku",
    header: t("productSku"),
    cell: (info) => (
      <span className="font-mono text-sm">{info.getValue() || "-"}</span>
    ),
  }),
  columnHelper.accessor((row) => row.product?.name, {
    id: "productName",
    header: t("productName"),
    cell: (info) => (
      <span className="font-medium">{info.getValue() || "-"}</span>
    ),
  }),
  columnHelper.accessor("rent_from_date", {
    header: t("fromDate"),
    cell: (info) => {
      const value = info.getValue();
      if (!value) return <span className="text-muted-foreground">-</span>;
      const date = new Date(value);
      return <span className="text-sm">{format(date, "MMM dd, yyyy")}</span>;
    },
  }),
  columnHelper.accessor("rent_to_date", {
    header: t("toDate"),
    cell: (info) => {
      const value = info.getValue();
      if (!value) return <span className="text-muted-foreground">-</span>;
      const date = new Date(value);
      return <span className="text-sm">{format(date, "MMM dd, yyyy")}</span>;
    },
  }),
  columnHelper.accessor((row) => row.order?.increment_id, {
    id: "orderId",
    header: t("orderId"),
    cell: (info) => {
      const value = info.getValue();
      if (!value) return <span className="font-medium">-</span>;
      return (
        <Link
          href={`/${locale}/account/order/view/${value}`}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          #{value}
        </Link>
      );
    },
  }),
];
