"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Calendar, X } from "lucide-react";
import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { Button } from "@shared/ui/button";
import type { MiniCartItemProps } from "../model/interface";

export default function MiniCartItem({
  item,
  onRemove,
  isUpdating,
}: MiniCartItemProps) {
  const { uid, product, prices, rent_from_date, rent_to_date } = item;
  const locale = useLocale();
  const t = useTranslations("mini-cart");

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  const hasRentalDates = rent_from_date && rent_to_date;
  const rentalDays = hasRentalDates
    ? differenceInCalendarDays(
        parseISO(rent_to_date),
        parseISO(rent_from_date),
      ) + 1
    : 0;

  return (
    <div className="flex flex-col sm:flex-row gap-4 py-4">
      {/* Desktop layout: image + content side by side */}
      <div className="flex gap-4 flex-1">
        <Link
          href={`/${locale}/products/p/${product.url_key}`}
          className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border"
        >
          <Image
            src={product.thumbnail.url}
            alt={product.thumbnail.label || product.name}
            fill
            className="object-cover"
          />
        </Link>

        <div className="flex flex-1 flex-col">
          <div className="flex justify-between">
            <Link
              href={`/${locale}/products/p/${product.url_key}`}
              className="text-sm font-medium hover:underline flex-1"
            >
              {product.name}
            </Link>
            {/* Desktop: trash button next to title */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex h-8 w-8 -mr-2"
              onClick={() => onRemove(uid)}
              disabled={isUpdating}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            {t("sku")} {product.sku}
          </p>

          {/* Rental dates */}
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>
              {hasRentalDates
                ? `${formatDate(rent_from_date)} - ${formatDate(rent_to_date)}`
                : "-"}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-end gap-1.5">
            <p className="text-sm font-semibold">
              {prices.row_total_including_tax.currency}{" "}
              {prices.row_total_including_tax.value.toFixed(2)}
            </p>
            {rentalDays > 0 && (
              <span className="text-xs text-muted-foreground">
                ({rentalDays} {t("days")})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: full-width trash button at bottom */}
      <Button
        variant="outline"
        size="sm"
        className="sm:hidden w-full"
        onClick={() => onRemove(uid)}
        disabled={isUpdating}
      >
        <X className="h-4 w-4 mr-2" />
        {t("remove")}
      </Button>
    </div>
  );
}
