"use client";

import { useTranslations } from "next-intl";
import { ShoppingCart } from "lucide-react";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@shared/ui/sheet";
import { MiniCartContent } from "@widgets/mini-cart";
import { cn } from "@shared/lib/utils";
import { useCartMenu } from "../lib/useCartMenu";
import type { CartMenuProps } from "../model/interface";

export default function CartMenu({ className }: CartMenuProps) {
  const { isOpen, handleCartClick, handleClose, itemCount, cart } =
    useCartMenu();
  const t = useTranslations("cart-menu");

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={cn("relative", className)}
        onClick={handleCartClick}
        aria-label={t("cartAriaLabel")}
      >
        <ShoppingCart className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full p-0 text-xs flex items-center justify-center"
          >
            {itemCount > 99 ? t("badgeOverflow") : itemCount}
          </Badge>
        )}
      </Button>

      {/* Sheet sidebar - Desktop only */}
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent className="hidden lg:flex flex-col p-0">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>{t("shoppingCart")}</SheetTitle>
          </SheetHeader>
          <MiniCartContent cart={cart} onClose={handleClose} />
        </SheetContent>
      </Sheet>
    </>
  );
}
