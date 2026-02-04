import type { Cart } from "@entities/cart";

export interface CartPageRouteProps {
  params: Promise<{ locale: string }>;
}

export interface CartPageProps {
  cart: Cart | null;
}
