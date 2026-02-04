"use client";

import { createColumnHelper } from "@tanstack/react-table";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@shared/ui/badge";
import { formatPrice } from "@shared/lib/formatCurrency";
import type { RentedProduct } from "@entities/rented-product";
import { RentalActionsDropdown } from "../ui/RentalActionsDropdown";

const columnHelper = createColumnHelper<RentedProduct>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createColumns = (t: any, locale: string) => [
  columnHelper.accessor("product_image_url", {
    header: t("image"),
    cell: (info) => {
      const imageUrl = info.getValue();
      return imageUrl ? (
        <div className="relative h-12 w-12">
          <Image
            src={imageUrl}
            alt={t("productImageAlt")}
            fill
            className="rounded object-cover"
            sizes="48px"
          />
        </div>
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
          {t("noImage")}
        </div>
      );
    },
  }),
  columnHelper.accessor("product_name", {
    header: t("productName"),
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor("rental_start_date", {
    header: t("startDate"),
    cell: (info) => {
      const date = new Date(info.getValue());
      return <span className="text-sm">{format(date, "MMM dd, yyyy")}</span>;
    },
  }),
  columnHelper.accessor("rental_end_date", {
    header: t("endDate"),
    cell: (info) => {
      const date = new Date(info.getValue());
      return <span className="text-sm">{format(date, "MMM dd, yyyy")}</span>;
    },
  }),
  columnHelper.accessor("quantity", {
    header: t("quantity"),
    cell: (info) => (
      <span className="text-sm text-muted-foreground">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("total_price", {
    header: t("totalPrice"),
    cell: (info) => (
      <span className="font-medium">{formatPrice(info.getValue())}</span>
    ),
  }),
  columnHelper.accessor("status", {
    header: t("status"),
    cell: (info) => {
      const status = info.getValue();
      let variant: "default" | "secondary" | "destructive" = "default";

      if (status === "completed") variant = "secondary";
      if (status === "cancelled") variant = "destructive";

      return <Badge variant={variant}>{t(`status_${status}`)}</Badge>;
    },
  }),
  columnHelper.display({
    id: "actions",
    header: t("actions"),
    cell: (props) => (
      <RentalActionsDropdown
        rental={{
          id: props.row.original.id,
          product_url_key: props.row.original.product_url_key,
          status: props.row.original.status,
        }}
        locale={locale}
      />
    ),
  }),
];
