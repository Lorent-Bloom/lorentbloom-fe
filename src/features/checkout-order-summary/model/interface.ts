import type { Cart } from "@entities/cart";

export interface OrderSummaryProps {
  cart: Cart;
  className?: string;
}
