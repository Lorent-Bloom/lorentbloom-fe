"use client";

import { useSyncExternalStore } from "react";
import { useWishlistStore } from "@entities/wishlist";

const emptySubscribe = () => () => {};

export const useWishlistIcon = () => {
  const { items } = useWishlistStore();
  const itemCount = items.length;
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  return {
    itemCount,
    isClient,
  };
};
