import { format, parseISO } from "date-fns";
import type { Cart } from "@entities/cart";

export const useOrderSummary = (cart: Cart) => {
  const itemCount = cart.total_quantity;
  const subtotal = cart.prices.subtotal_including_tax;
  const grandTotal = cart.prices.grand_total;
  const rentalTotal = cart.prices.rental_total;

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  const formatRentalPeriod = (
    rentFromDate?: string | null,
    rentToDate?: string | null,
  ) => {
    if (!rentFromDate || !rentToDate) return null;
    return `${formatDate(rentFromDate)} - ${formatDate(rentToDate)}`;
  };

  return {
    itemCount,
    subtotal,
    grandTotal,
    rentalTotal,
    items: cart.items,
    billingAddress: cart.billing_address,
    formatRentalPeriod,
  };
};
