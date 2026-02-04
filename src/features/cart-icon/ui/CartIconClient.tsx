"use client";

import { useTranslations } from "next-intl";
import { ShoppingCart } from "lucide-react";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { cn } from "@shared/lib/utils";
import type { CartIconClientProps } from "../model/interface";

export default function CartIconClient({
  itemCount,
  onCartClick,
  className,
}: CartIconClientProps) {
  const t = useTranslations("cart-icon");

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("relative", className)}
      onClick={onCartClick}
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
  );
}
