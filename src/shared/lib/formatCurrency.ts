import { STORE_CURRENCY } from "@shared/config/currency";

interface Money {
  value: number;
  currency: string;
}

export function formatCurrency(money: Money): string {
  return `${money.currency} ${money.value.toFixed(2)}`;
}

export function formatPrice(
  value: number,
  currency: string = STORE_CURRENCY,
): string {
  return `${currency} ${value.toFixed(2)}`;
}
