import { getCart } from "@entities/cart";
import CartIconClient from "./CartIconClient";
import type { CartIconProps } from "../model/interface";

export default async function CartIcon({ className }: CartIconProps) {
  const cartResponse = await getCart();
  const itemCount =
    cartResponse.success && cartResponse.data
      ? cartResponse.data.total_quantity
      : 0;

  const handleCartClick = () => {
    // This will be handled by the client component
  };

  return (
    <CartIconClient
      itemCount={itemCount}
      onCartClick={handleCartClick}
      className={className}
    />
  );
}
