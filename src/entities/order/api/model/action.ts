import type { Order, OrderDetail } from "./entity";

export interface PlaceOrderInput {
  cartId: string;
}

export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PlaceOrderData {
  order_number: string;
}

export type PlaceOrderActionResponse = ActionResponse<PlaceOrderData>;
export type GetCustomerOrdersActionResponse = ActionResponse<Order[]>;
export type GetOrderDetailActionResponse = ActionResponse<OrderDetail>;
