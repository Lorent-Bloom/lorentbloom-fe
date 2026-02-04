import type { Cart } from "@entities/cart";
import type { CustomerAddress } from "@entities/customer-address";
import type { Customer } from "@entities/customer";
import type { OwnerInfo } from "../lib/useCheckoutPage";

export interface CheckoutPageProps {
  cart: Cart;
  savedAddresses: CustomerAddress[];
  locale: string;
  customer?: Customer | null;
  ownerInfo?: OwnerInfo | null;
}
