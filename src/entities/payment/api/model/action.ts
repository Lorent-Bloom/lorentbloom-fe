import type { PaymentMethod } from "./entity";

export interface SetPaymentMethodInput {
  cartId: string;
  paymentMethodCode: string;
}

export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type SetPaymentMethodActionResponse = ActionResponse<PaymentMethod>;
export type GetAvailablePaymentMethodsActionResponse = ActionResponse<
  PaymentMethod[]
>;
