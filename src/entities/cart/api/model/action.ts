export interface CartItemInput {
  sku: string;
  quantity: number;
  selected_options?: string[];
  entered_options?: Array<{
    uid: string;
    value: string;
  }>;
  rent_from_date?: string;
  rent_to_date?: string;
}

export interface AddToCartInput {
  cartItems: CartItemInput[];
}

export interface CartItemUpdateInput {
  cart_item_uid: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  cartItems: CartItemUpdateInput[];
}

export interface RemoveCartItemInput {
  cartItemUid: string;
}

export interface SetBillingAddressInput {
  cartId: string;
  customerAddressId: number;
}

export interface SetShippingAddressInput {
  cartId: string;
  customerAddressId: number;
}

export interface ActionResponse<T> {
  success: boolean;
  error?: string;
  data?: T;
}
