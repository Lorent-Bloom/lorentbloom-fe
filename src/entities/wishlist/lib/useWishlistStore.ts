"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@entities/product";
import type { WishlistState, WishlistItem } from "../model/interface";

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product: Product) => {
        const { items, isInWishlist } = get();

        if (isInWishlist(product.uid)) {
          return;
        }

        const newItem: WishlistItem = {
          product,
          addedAt: Date.now(),
        };

        set({ items: [...items, newItem] });
      },

      removeFromWishlist: (productUid: string) => {
        const { items } = get();
        set({ items: items.filter((item) => item.product.uid !== productUid) });
      },

      isInWishlist: (productUid: string) => {
        const { items } = get();
        return items.some((item) => item.product.uid === productUid);
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: "wishlist-storage",
    },
  ),
);
