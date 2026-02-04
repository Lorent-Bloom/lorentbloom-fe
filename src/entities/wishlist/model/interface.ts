import type { Product } from "@entities/product";

export interface WishlistItem {
  product: Product;
  addedAt: number;
}

export interface WishlistState {
  items: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productUid: string) => void;
  isInWishlist: (productUid: string) => boolean;
  clearWishlist: () => void;
}
