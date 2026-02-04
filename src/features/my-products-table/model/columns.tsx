"use client";

import { createColumnHelper } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "@shared/ui";
import { formatPrice } from "@shared/lib/formatCurrency";
import type { CustomerProduct } from "@entities/customer-product";
import { ProductActionsDropdown } from "../ui/ProductActionsDropdown";

const columnHelper = createColumnHelper<CustomerProduct>();

export const createColumns = (
  t: (key: string) => string,
  locale: string,
  onEdit: (product: CustomerProduct) => void,
) => [
  columnHelper.accessor("images", {
    header: t("image"),
    cell: (info) => {
      const images = info.getValue();
      const mainImage = images.find((img) => img.is_main) || images[0];
      return mainImage ? (
        <div className="relative h-12 w-12">
          <Image
            src={mainImage.url}
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
  columnHelper.accessor("name", {
    header: t("name"),
    cell: (info) => {
      const product = info.row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{info.getValue()}</span>
          <span className="text-xs text-muted-foreground">{product.sku}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor("city_name", {
    header: t("city"),
    cell: (info) => <span>{info.getValue() || "-"}</span>,
  }),
  columnHelper.accessor("price", {
    header: t("price"),
    cell: (info) => <span>{formatPrice(info.getValue())}</span>,
  }),
  columnHelper.accessor("quantity", {
    header: t("quantity"),
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  columnHelper.accessor("is_active", {
    header: t("isActive"),
    cell: (info) => {
      // is_active: 1 = Active, 2 = Disabled
      const is_active = info.getValue();
      const isActive = is_active === 1;
      return (
        <Badge variant={isActive ? "default" : "outline"}>
          {isActive ? t("active") : t("disabled")}
        </Badge>
      );
    },
  }),
  columnHelper.accessor("product_status", {
    header: t("productStatus"),
    cell: (info) => {
      const status = info.getValue();
      if (status === null || status === undefined) {
        return <Badge variant="outline">-</Badge>;
      }
      // Map numeric status to string
      // 0 = Pending, 1 = Send To Approve, 2 = Approved, 3 = Rejected
      const statusMap: Record<number, string> = {
        0: "pending",
        1: "pending",
        2: "approved",
        3: "rejected",
      };
      // Convert to number if it's a string number
      const statusNum = typeof status === "number" ? status : Number(status);
      const statusKey = !isNaN(statusNum) ? statusMap[statusNum] : String(status).toLowerCase();
      if (!statusKey) {
        return <Badge variant="outline">-</Badge>;
      }
      // Map status to badge variant
      const variantMap: Record<
        string,
        "default" | "secondary" | "outline" | "destructive"
      > = {
        approved: "default",
        pending: "secondary",
        rejected: "destructive",
      };
      const variant = variantMap[statusKey] || "outline";
      return (
        <Badge variant={variant}>
          {t(`productStatus_${statusKey}`) || statusKey}
        </Badge>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    header: t("actions"),
    cell: (props) => (
      <ProductActionsDropdown
        product={props.row.original}
        locale={locale}
        onEdit={onEdit}
      />
    ),
  }),
];
