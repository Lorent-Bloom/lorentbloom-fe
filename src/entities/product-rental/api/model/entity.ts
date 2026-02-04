export interface ProductRentalProduct {
  sku: string;
  name: string;
}

export interface ProductRentalOrder {
  order_id: string;
  increment_id: string;
}

export interface ProductRental {
  reservation_id: string;
  rent_from_date: string;
  rent_to_date: string;
  created_at: string;
  product: ProductRentalProduct;
  order: ProductRentalOrder;
}

export interface PageInfo {
  current_page: number;
  page_size: number;
  total_pages: number;
}

export interface MyProductsRentalsResponse {
  myProductsRentals: {
    total_count: number;
    items: ProductRental[];
    page_info: PageInfo;
  };
}
