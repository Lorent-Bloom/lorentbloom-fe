"use client";

import { Calendar } from "lucide-react";
import { parseISO, differenceInCalendarDays } from "date-fns";
import { useTranslations } from "next-intl";
import { Card } from "@shared/ui/card";
import { Separator } from "@shared/ui/separator";
import { useOrderSummary } from "../lib/useOrderSummary";
import type { OrderSummaryProps } from "../model/interface";
import Image from "next/image";

export default function OrderSummary({ cart, className }: OrderSummaryProps) {
  const {
    itemCount,
    subtotal,
    grandTotal,
    rentalTotal,
    items,
    billingAddress,
    formatRentalPeriod,
  } = useOrderSummary(cart);
  const t = useTranslations("checkout-order-summary");

  return (
    <Card className={className}>
      <div className="p-6">
        <h3 className="text-lg font-semibold">{t("order_summary")}</h3>

        <div className="mt-6 space-y-4">
          {items.map((item) => {
            const rentalPeriod = formatRentalPeriod(
              item.rent_from_date,
              item.rent_to_date,
            );
            const rentalDays =
              item.rent_from_date && item.rent_to_date
                ? differenceInCalendarDays(
                    parseISO(item.rent_to_date),
                    parseISO(item.rent_from_date),
                  ) + 1
                : 0;

            return (
              <div key={item.uid} className="flex gap-4">
                <div className="flex-shrink-0">
                  <Image
                    src={item.product.thumbnail.url}
                    alt={item.product.thumbnail.label}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("qty")} {item.quantity}
                  </p>
                  {rentalPeriod && (
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{rentalPeriod}</span>
                    </div>
                  )}
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <p className="text-sm font-medium">
                      {item.prices.row_total_including_tax.currency}{" "}
                      {item.prices.row_total_including_tax.value.toFixed(2)}
                    </p>
                    {rentalDays > 0 && (
                      <span className="text-xs text-muted-foreground">
                        ({rentalDays} {t("days")})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Separator className="my-6" />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {t("subtotal")} ({itemCount} {t("items")})
            </span>
            <span>
              {subtotal.currency} {subtotal.value.toFixed(2)}
            </span>
          </div>
          {rentalTotal && rentalTotal.value > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("rentalTotal")}</span>
              <span>
                {rentalTotal.currency} {rentalTotal.value.toFixed(2)}
              </span>
            </div>
          )}

          <Separator className="my-4" />

          <div className="flex justify-between text-base font-semibold">
            <span>{t("total")}</span>
            <span>
              {grandTotal.currency} {grandTotal.value.toFixed(2)}
            </span>
          </div>
        </div>

        {billingAddress && (
          <>
            <Separator className="my-6" />
            <div>
              <h4 className="mb-2 text-sm font-semibold">
                {t("billing_address")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {billingAddress.firstname} {billingAddress.lastname}
                <br />
                {billingAddress.street.join(", ")}
                <br />
                {billingAddress.city}, {billingAddress.region?.label}{" "}
                {billingAddress.postcode}
                <br />
                {billingAddress.country.label}
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
