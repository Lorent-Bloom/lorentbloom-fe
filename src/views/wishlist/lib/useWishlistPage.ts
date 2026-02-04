"use client";

import { useTranslations } from "next-intl";
import { useWishlistStore } from "@entities/wishlist";
import type { WishlistPageProps } from "../model/interface";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useWishlistPage = (props: WishlistPageProps) => {
  const t = useTranslations("wishlist");
  const { items, clearWishlist } = useWishlistStore();

  const hasItems = items.length > 0;

  const handleClearWishlist = () => {
    if (confirm(t("confirmClear"))) {
      clearWishlist();
    }
  };

  return {
    t,
    items,
    hasItems,
    handleClearWishlist,
  };
};
