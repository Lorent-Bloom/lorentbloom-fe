import type {
  CustomerProduct,
  CustomerProductsResult,
  ProductStatus,
} from "./entity";

export type SortEnum = "ASC" | "DESC";

export interface ProductAttributeSortInput {
  name?: SortEnum;
  position?: SortEnum;
  price?: SortEnum;
  relevance?: SortEnum;
}

export interface GetCustomerProductsInput {
  search?: string;
  filter?: Record<string, unknown>;
  pageSize?: number;
  currentPage?: number;
  sort?: ProductAttributeSortInput;
}

export interface GetCustomerProductsResponse {
  customerProducts: CustomerProductsResult;
}

export interface ProductImageInput {
  file: string; // base64 or upload key
  position: number;
  is_main: boolean;
  url?: string; // URL of existing image (for update operations)
}

export interface CreateProductInput {
  name: string;
  description?: string;
  short_description?: string;
  category?: number; // Main category ID (level 2)
  subcategory?: number; // Subcategory ID (level 3)
  sub_subcategory?: number; // Sub-subcategory ID (level 4)
  new_category_path?: string; // New category path joined by " > " (e.g. "Cat1 > Cat2 > Cat3")
  city?: number; // City ID
  color?: number; // Color attribute option ID
  manufacturer?: string;
  price: number;
  quantity: number;
  images: ProductImageInput[];
  is_active: ProductStatus; // 1 = Active, 2 = Disabled
}

export interface UpdateProductInput {
  id: string;
  name?: string;
  description?: string;
  short_description?: string;
  category?: number; // Main category ID (level 2)
  subcategory?: number; // Subcategory ID (level 3)
  sub_subcategory?: number; // Sub-subcategory ID (level 4)
  new_category_path?: string; // New category path joined by " > " (e.g. "Cat1 > Cat2 > Cat3")
  city?: number; // City ID
  color?: number; // Color attribute option ID
  manufacturer?: string;
  price?: number;
  quantity?: number;
  images?: ProductImageInput[];
  is_active?: ProductStatus; // 1 = Active, 2 = Disabled
}

export interface CreateProductResponse {
  createCustomerProduct: CustomerProduct;
}

export interface UpdateProductResponse {
  updateCustomerProduct: CustomerProduct;
}

export interface DeleteProductResponse {
  deleteCustomerProduct: {
    success: boolean;
  };
}

export interface GetProductResponse {
  customerProduct: CustomerProduct;
}
