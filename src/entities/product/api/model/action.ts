import type {
  ProductsResult,
  ProductAttributeSortInput,
  ProductDetail,
} from "./entity";

// Filter value types for different attribute types
type FilterEqValue = {
  eq?: string;
  in?: string[];
};

type FilterMatchValue = {
  match?: string;
};

type FilterRangeValue = {
  from?: string;
  to?: string;
};

// Product filter input supporting dynamic attributes
export interface ProductFilterInput {
  // Core filters
  category_id?: FilterEqValue;
  category_uid?: FilterEqValue;
  price?: FilterRangeValue;
  name?: FilterMatchValue;

  // Dynamic attributes - any string attribute can be filtered
  // Examples: color, size, manufacturer, material, etc.
  [key: string]:
    | FilterEqValue
    | FilterMatchValue
    | FilterRangeValue
    | undefined;
}

export interface GetProductsInput {
  search?: string;
  filter?: ProductFilterInput;
  pageSize?: number;
  currentPage?: number;
  sort?: ProductAttributeSortInput;
}

export interface GetProductsResponse {
  products: ProductsResult;
}

export interface GetProductDetailResponse {
  products: {
    items: ProductDetail[];
  };
}
