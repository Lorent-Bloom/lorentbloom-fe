export interface Money {
  value: number;
  currency: string;
}

export interface ProductImage {
  url: string;
  label: string;
}

export interface PriceRange {
  minimum_price: {
    regular_price: Money;
    final_price: Money;
  };
}

export interface CartItemProduct {
  sku: string;
  name: string;
  url_key: string;
  thumbnail: ProductImage;
  price_range: PriceRange;
}

export interface CartItemPrices {
  row_total: Money;
  row_total_including_tax: Money;
  total_item_discount: Money;
}

export interface CartItem {
  uid: string;
  quantity: number;
  product: CartItemProduct;
  prices: CartItemPrices;
  rent_from_date?: string | null;
  rent_to_date?: string | null;
  rental_total?: number;
}

export interface AppliedTax {
  amount: Money;
  label: string;
}

export interface CartPrices {
  grand_total: Money;
  subtotal_excluding_tax: Money;
  subtotal_including_tax: Money;
  rental_total?: Money;
  applied_taxes?: AppliedTax[];
}

export interface Region {
  code: string;
  label: string;
}

export interface Country {
  code: string;
  label: string;
}

export interface BillingAddress {
  firstname: string;
  lastname: string;
  street: string[];
  city: string;
  region?: Region;
  postcode: string;
  country: Country;
  telephone: string;
}

export interface AvailableShippingMethod {
  carrier_code: string;
  carrier_title: string;
  method_code: string;
  method_title: string;
  amount: Money;
}

export interface ShippingAddress {
  firstname: string;
  lastname: string;
  street: string[];
  city: string;
  region?: Region;
  postcode: string;
  country: Country;
  telephone: string;
  available_shipping_methods?: AvailableShippingMethod[];
}

export interface Cart {
  id: string;
  total_quantity: number;
  items: CartItem[];
  prices: CartPrices;
  billing_address?: BillingAddress;
  shipping_addresses?: ShippingAddress[];
}

export interface CustomerCartResponse {
  customerCart: Cart;
}

export interface AddProductsToCartResponse {
  addProductsToCart: {
    cart: Cart;
    user_errors: Array<{
      code: string;
      message: string;
    }>;
  };
}

export interface UpdateCartItemsResponse {
  updateCartItems: {
    cart: Cart;
  };
}

export interface RemoveItemFromCartResponse {
  removeItemFromCart: {
    cart: Cart;
  };
}

export interface SetBillingAddressOnCartResponse {
  setBillingAddressOnCart: {
    cart: {
      billing_address: BillingAddress;
    };
  };
}

export interface SetShippingAddressesOnCartResponse {
  setShippingAddressesOnCart: {
    cart: {
      shipping_addresses: ShippingAddress[];
    };
  };
}
