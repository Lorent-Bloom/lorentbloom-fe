"use client";

import { useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useWishlistStore } from "@entities/wishlist";
import { useCheckAuth } from "@entities/customer";
import type { Product } from "@entities/product";

export interface UseProductCardProps {
  product: Product;
}

const emptySubscribe = () => () => {};

export const useProductCard = ({ product }: UseProductCardProps) => {
  const locale = useLocale();
  const t = useTranslations("product-grid");
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const { checkAuth } = useCheckAuth();

  const imageUrl =
    product.image?.url || product.small_image?.url || product.thumbnail?.url;
  const imageLabel = product.image?.label || product.name;

  const price =
    product.price_range.minimum_price.final_price ||
    product.price_range.minimum_price.regular_price;

  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();

  // Only check wishlist status after component has mounted (client-side)
  const isWishlisted = mounted ? isInWishlist(product.uid) : false;

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Construct the product details URL for redirect after sign-in
    const productDetailsUrl = `/${locale}/products/p/${product.url_key}`;

    // Check if user is authenticated before toggling wishlist
    const isAuthenticated = await checkAuth(productDetailsUrl);

    if (!isAuthenticated) {
      // User will be redirected to sign-in by checkAuth with product details URL
      return;
    }

    if (isWishlisted) {
      removeFromWishlist(product.uid);
      toast.success(t("removedFromWishlist"));
    } else {
      addToWishlist(product);
      toast.success(t("addedToWishlist"));
    }
  };

  return {
    locale,
    imageUrl,
    imageLabel,
    price,
    isWishlisted,
    handleToggleWishlist,
    t,
  };
};
