export interface OrderItem {
  product_name: string;
  quantity_ordered: number;
  rent_from_date?: string | null;
  rent_to_date?: string | null;
}

export interface Order {
  id: string;
  order_number: string;
  created_at: string;
  grand_total: number;
  status: string;
  items: OrderItem[];
}

export interface PlaceOrderError {
  message: string;
  code: string;
}

export interface PlaceOrderResponse {
  placeOrder: {
    order: {
      order_number: string;
    } | null;
    errors?: PlaceOrderError[];
  };
}

export interface CustomerOrdersResponse {
  customer: {
    orders: {
      items: Order[];
    };
  };
}

// Detailed Order Types

export interface Money {
  value: number;
  currency: string;
}

export interface OrderAddress {
  firstname: string;
  lastname: string;
  company?: string;
  street: string[];
  city: string;
  region?: string;
  postcode: string;
  country_code: string;
  telephone: string;
}

export interface OrderPaymentMethod {
  name: string;
  type: string;
}

export interface OrderItemDetail {
  id: string;
  product_name: string;
  product_sku: string;
  product_url_key?: string;
  quantity_ordered: number;
  quantity_shipped?: number;
  quantity_invoiced?: number;
  quantity_refunded?: number;
  quantity_canceled?: number;
  status: string;
  product_sale_price: Money;
  selected_options?: Array<{
    label: string;
    value: string;
  }>;
  discounts?: Array<{
    amount: Money;
    label: string;
  }>;
  rent_from_date?: string | null;
  rent_to_date?: string | null;
}

export interface OrderDiscount {
  amount: Money;
  label: string;
}

export interface OrderTax {
  amount: Money;
  title: string;
  rate: number;
}

export interface OrderTotal {
  subtotal: Money;
  grand_total: Money;
  total_shipping: Money;
  total_tax: Money;
  discounts?: OrderDiscount[];
  taxes?: OrderTax[];
}

export interface OrderCustomerInfo {
  id: number | null;
  email: string | null;
  telephone: string | null;
  firstname: string;
  lastname: string | null;
}

export interface ParentOrderCustomerInfo {
  id: number | null;
  email: string | null;
  firstname: string | null;
  lastname: string | null;
  telephone: string | null;
}

export interface OrderDetail {
  id: string;
  // customer.orders uses 'number', myRentalOrders uses 'order_number'
  number?: string;
  order_number?: string;
  // customer.orders uses 'order_date', myRentalOrders uses 'created_at'
  order_date?: string;
  created_at?: string;
  status: string;
  carrier?: string;
  shipping_method?: string;
  customer_info: OrderCustomerInfo;
  parent_customer_info: ParentOrderCustomerInfo | null;
  billing_address: OrderAddress;
  shipping_address: OrderAddress;
  payment_methods: OrderPaymentMethod[];
  items: OrderItemDetail[];
  total: OrderTotal;
}

// Response for buyer's orders (customer.orders)
export interface CustomerOrderDetailResponse {
  customer: {
    orders: {
      items: OrderDetail[];
    };
  };
}

// Response for owner's rental orders (myRentalOrders)
export interface RentalOrderDetailResponse {
  myRentalOrders: {
    items: OrderDetail[];
  };
}
