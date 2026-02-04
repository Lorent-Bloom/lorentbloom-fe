export interface RentedProduct {
  id: string;
  product_id: string;
  product_sku: string;
  product_name: string;
  product_image_url: string | null;
  product_url_key: string;
  rental_start_date: string;
  rental_end_date: string;
  quantity: number;
  price_per_day: number;
  total_price: number;
  status: "active" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface RentedProductsResult {
  items: RentedProduct[];
  page_info: {
    current_page: number;
    page_size: number;
    total_pages: number;
  };
  total_count: number;
}
