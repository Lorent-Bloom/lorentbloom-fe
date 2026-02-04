import type { Cart, CartItem } from "@entities/cart";

export interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export interface MiniCartContentProps {
  cart: Cart | null;
  onClose: () => void;
}

export interface MiniCartItemProps {
  item: CartItem;
  onRemove: (itemId: string) => void;
  isUpdating: boolean;
}
