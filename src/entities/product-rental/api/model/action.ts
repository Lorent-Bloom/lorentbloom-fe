import type { ProductRental, PageInfo } from "./entity";

export interface DateRangeFilter {
  from?: string;
  to?: string;
}

export interface MyProductsRentalsFilter {
  from_date?: DateRangeFilter;
}

export interface GetMyProductsRentalsInput {
  pageSize?: number;
  currentPage?: number;
  filter?: MyProductsRentalsFilter;
}

export interface GetMyProductsRentalsData {
  items: ProductRental[];
  page_info: PageInfo;
  total_count: number;
}

export interface GetMyProductsRentalsActionResponse {
  success: boolean;
  data?: GetMyProductsRentalsData;
  error?: string;
}
