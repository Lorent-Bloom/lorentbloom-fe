export type ProductApprovalStatus =
  | "CREATED"
  | "APPROVED"
  | "PENDING"
  | "REJECTED";

// Product status from backend (e.g., "pending", "approved", "rejected")
export type ProductStatusType = string;

export interface ProductImage {
  id: string;
  url: string;
  file: string; // base64 or upload key
  position: number;
  is_main: boolean;
}

// Product is_active: 1 = Active, 2 = Disabled
export type ProductStatus = 1 | 2;

export interface CustomerProduct {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  short_description: string | null;
  // Category fields for form editing
  category_id: string | null;
  subcategory_id: string | null;
  sub_subcategory_id: string | null;
  new_category_path: string | null;
  city: number | null;
  city_name: string | null;
  color: string | null;
  manufacturer: string | null;
  price: number;
  quantity: number;
  images: ProductImage[];
  is_active: ProductStatus;
  product_status: ProductStatusType;
  created_at: string;
  updated_at: string;
}

export interface CustomerProductsResult {
  items: CustomerProduct[];
  page_info: {
    current_page: number;
    page_size: number;
    total_pages: number;
  };
  total_count: number;
}

export interface MagentoProductsResponse {
  myProducts: {
    items: unknown[];
    page_info: {
      current_page: number;
      page_size: number;
      total_pages: number;
    };
    total_count: number;
  };
}

export interface MagentoProductResponse {
  products: {
    items: unknown[];
  };
}
