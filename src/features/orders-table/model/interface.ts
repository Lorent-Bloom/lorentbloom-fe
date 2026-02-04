import type { Order } from "@entities/order";

export interface OrdersTableProps {
  orders: Order[];
  locale: string;
}
