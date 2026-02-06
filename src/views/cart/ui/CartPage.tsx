"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, ShoppingBag, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { Button } from "@shared/ui/button";
import { Separator } from "@shared/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { useCartPage } from "../lib/useCartPage";
import type { CartPageProps } from "../model/interface";

export default function CartPage({ cart }: CartPageProps) {
  const { isPending, handleRemoveItem, handleCheckout, locale } = useCartPage();
  const t = useTranslations("cart");

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center gap-6">
          <ShoppingBag className="h-24 w-24 text-muted-foreground" />
          <h1 className="text-3xl font-bold">{t("emptyCartTitle")}</h1>
          <p className="text-muted-foreground">{t("emptyCartDescription")}</p>
          <Button asChild size="lg">
            <Link href="/products">{t("continueShoppingButton")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("pageTitle")}</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {t("cartItemsTitle")} ({cart.total_quantity}{" "}
                {cart.total_quantity === 1 ? t("item") : t("items")})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {cart.items.map((item) => {
                  const rentalDays =
                    item.rent_from_date && item.rent_to_date
                      ? differenceInCalendarDays(
                          parseISO(item.rent_to_date),
                          parseISO(item.rent_from_date),
                        ) + 1
                      : 0;

                  return (
                  <div
                    key={item.uid}
                    className="flex flex-col sm:flex-row gap-4 p-6"
                  >
                    {/* Desktop layout: image + content side by side */}
                    <div className="flex gap-4 flex-1">
                      <Link
                        href={`/product/${item.product.url_key}`}
                        className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border"
                      >
                        <Image
                          src={item.product.thumbnail.url}
                          alt={
                            item.product.thumbnail.label || item.product.name
                          }
                          fill
                          className="object-cover"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <Link
                              href={`/product/${item.product.url_key}`}
                              className="text-lg font-semibold hover:underline"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">
                              {t("sku")} {item.product.sku}
                            </p>
                            {/* Rental dates */}
                            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {item.rent_from_date && item.rent_to_date
                                  ? `${formatDate(item.rent_from_date)} - ${formatDate(item.rent_to_date)}`
                                  : "-"}
                              </span>
                            </div>
                            {/* Mobile: price under SKU */}
                            <div className="mt-2 sm:hidden flex items-baseline gap-1.5">
                              <p className="text-lg font-semibold">
                                {item.prices.row_total_including_tax.currency}{" "}
                                {item.prices.row_total_including_tax.value.toFixed(
                                  2,
                                )}
                              </p>
                              {rentalDays > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  ({rentalDays} {t("days")})
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Desktop: trash button next to title */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hidden sm:flex"
                            onClick={() => handleRemoveItem(item.uid)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-5 w-5 text-destructive" />
                          </Button>
                        </div>

                        {/* Desktop: price on right side */}
                        <div className="mt-4 hidden sm:flex items-baseline justify-end gap-1.5">
                          <p className="text-lg font-semibold">
                            {item.prices.row_total_including_tax.currency}{" "}
                            {item.prices.row_total_including_tax.value.toFixed(
                              2,
                            )}
                          </p>
                          {rentalDays > 0 && (
                            <span className="text-sm text-muted-foreground">
                              ({rentalDays} {t("days")})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mobile: full-width delete button at bottom */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="sm:hidden w-full hover:bg-red-700 active:bg-red-800 dark:hover:bg-red-800 dark:active:bg-red-900"
                      onClick={() => handleRemoveItem(item.uid)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t("removeButton")}
                    </Button>
                  </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-[120px]">
            <CardHeader>
              <CardTitle>{t("orderSummaryTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("subtotal")}</span>
                  <span className="font-medium">
                    {cart.prices.subtotal_including_tax.currency}{" "}
                    {cart.prices.subtotal_including_tax.value.toFixed(2)}
                  </span>
                </div>
                {cart.prices.rental_total &&
                  cart.prices.rental_total.value > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("rentalTotal")}
                      </span>
                      <span className="font-medium">
                        {cart.prices.rental_total.currency}{" "}
                        {cart.prices.rental_total.value.toFixed(2)}
                      </span>
                    </div>
                  )}
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>{t("total")}</span>
                <span>
                  {cart.prices.grand_total.currency}{" "}
                  {cart.prices.grand_total.value.toFixed(2)}
                </span>
              </div>

              <Button className="w-full" size="lg" onClick={handleCheckout}>
                {t("proceedToCheckout")}
              </Button>

              <Button className="w-full" variant="outline" asChild>
                <Link href={`/${locale}/products`}>
                  {t("continueShoppingButton")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
