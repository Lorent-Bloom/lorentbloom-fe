import type { Document } from "@entities/document";
import type { OrderDetail } from "@entities/order";
import type { Customer } from "@entities/customer";

export interface SignContractPageProps {
  orderId: string;
  document: Document | null;
  order: OrderDetail | null;
  customer: Customer | null;
  locale: string;
  error?: string;
}
