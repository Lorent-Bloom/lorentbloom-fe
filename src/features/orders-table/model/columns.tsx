"use client";

import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@shared/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@shared/ui/tooltip";
import { formatPrice } from "@shared/lib/formatCurrency";
import type { Order } from "@entities/order";

const columnHelper = createColumnHelper<Order>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createColumns = (t: any, locale: string) => [
  columnHelper.accessor("order_number", {
    header: t("orderNumber"),
    cell: (info) => (
      <Link
        href={`/${locale}/account/order/view/${info.getValue()}`}
        className="font-medium text-primary underline-offset-4 hover:underline"
      >
        #{info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor("created_at", {
    header: t("date"),
    cell: (info) => {
      const date = new Date(info.getValue());
      return <span className="text-sm">{format(date, "MMM dd, yyyy")}</span>;
    },
  }),
  columnHelper.accessor("items", {
    header: t("items"),
    cell: (info) => {
      const items = info.getValue();
      const totalItems = items.reduce(
        (sum, item) => sum + item.quantity_ordered,
        0,
      );

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help underline decoration-dotted underline-offset-2">
              {t("itemsCount", { count: totalItems })}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <ul className="space-y-1">
              {items.map((item, index) => (
                <li key={index} className="text-xs">
                  {item.quantity_ordered}x {item.product_name}
                </li>
              ))}
            </ul>
          </TooltipContent>
        </Tooltip>
      );
    },
  }),
  columnHelper.accessor("grand_total", {
    header: t("total"),
    cell: (info) => (
      <span className="font-medium">{formatPrice(info.getValue())}</span>
    ),
  }),
  columnHelper.accessor("status", {
    header: t("status"),
    cell: (info) => {
      const status = info.getValue();
      let variant: "default" | "secondary" | "destructive" | "outline" =
        "default";

      switch (status.toLowerCase()) {
        case "complete":
        case "completed":
          variant = "secondary";
          break;
        case "canceled":
        case "cancelled":
          variant = "destructive";
          break;
        case "pending":
        case "processing":
          variant = "outline";
          break;
        default:
          variant = "default";
      }

      return (
        <Badge variant={variant}>
          {t(`status_${status.toLowerCase()}`, { defaultValue: status })}
        </Badge>
      );
    },
  }),
];
