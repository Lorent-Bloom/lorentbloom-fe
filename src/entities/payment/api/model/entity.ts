export interface PaymentMethod {
  code: string;
  title: string;
}

export interface AvailablePaymentMethodsResponse {
  cart: {
    available_payment_methods: PaymentMethod[];
  };
}

export interface SetPaymentMethodResponse {
  setPaymentMethodOnCart: {
    cart: {
      selected_payment_method: PaymentMethod;
    };
  };
}
