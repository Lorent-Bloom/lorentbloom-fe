"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@shared/ui/button";
import { Separator } from "@shared/ui/separator";
import MiniCartItem from "./MiniCartItem";
import { useMiniCart } from "../lib/useMiniCart";
import type { MiniCartContentProps } from "../model/interface";

export default function MiniCartContent({
  cart: initialCart,
  onClose,
}: MiniCartContentProps) {
  const {
    displayCart,
    displayItems,
    isLoading,
    isPending,
    handleRemoveItem,
    handleNavigateToCart,
    handleNavigateToCheckout,
  } = useMiniCart(true, initialCart);
  const t = useTranslations("mini-cart");

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  if (!displayCart || displayCart.items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        <p className="text-center text-muted-foreground">{t("cartEmpty")}</p>
        <Button onClick={onClose} asChild>
          <Link href="/products">{t("continueShopping")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y px-6">
          {displayItems.map((item) => (
            <MiniCartItem
              key={item.uid}
              item={item}
              onRemove={handleRemoveItem}
              isUpdating={isPending}
            />
          ))}
        </div>
      </div>

      <div className="border-t p-6 flex-shrink-0">
        <div className="space-y-4">
          <div className="flex justify-between text-base font-semibold">
            <span>{t("subtotal")}</span>
            <span>
              {displayCart.prices.subtotal_including_tax.currency}{" "}
              {displayCart.prices.subtotal_including_tax.value.toFixed(2)}
            </span>
          </div>
          {displayCart.prices.rental_total &&
            displayCart.prices.rental_total.value > 0 && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t("rentalTotal")}</span>
                <span>
                  {displayCart.prices.rental_total.currency}{" "}
                  {displayCart.prices.rental_total.value.toFixed(2)}
                </span>
              </div>
            )}

          <Separator />

          <div className="space-y-2">
            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                handleNavigateToCart();
                setTimeout(() => onClose(), 100);
              }}
            >
              {t("viewCart")}
            </Button>
            <Button
              className="w-full"
              size="lg"
              variant="outline"
              onClick={() => {
                handleNavigateToCheckout();
                setTimeout(() => onClose(), 100);
              }}
            >
              {t("checkout")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
