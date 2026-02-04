"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { cn } from "@shared/lib/utils";
import { useWishlistIcon } from "../lib/useWishlistIcon";
import type { WishlistIconClientProps } from "../model/interface";

export default function WishlistIconClient({
  className,
}: WishlistIconClientProps) {
  const locale = useLocale();
  const t = useTranslations("wishlist-icon");
  const { itemCount, isClient } = useWishlistIcon();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("relative", className)}
      aria-label={t("wishlist")}
      asChild
    >
      <Link href={`/${locale}/wishlist`}>
        <Heart className="h-5 w-5" />
        {isClient && itemCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full p-0 text-xs flex items-center justify-center"
          >
            {itemCount > 99 ? t("badgeOverflow") : itemCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}
