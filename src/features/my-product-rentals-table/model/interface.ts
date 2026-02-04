import type { DateRange } from "react-day-picker";
import type {
  ProductRental,
  PageInfo,
  MyProductsRentalsFilter,
} from "@entities/product-rental";

export interface MyProductRentalsTableProps {
  initialRentals: ProductRental[];
  initialPageInfo: PageInfo;
  initialTotalCount: number;
  locale: string;
}

export interface UseMyProductRentalsTableProps {
  initialRentals: ProductRental[];
  initialPageInfo: PageInfo;
  initialTotalCount: number;
  locale: string;
}

export interface FetchRentalsParams {
  page?: number;
  filter?: MyProductsRentalsFilter;
}

export type { DateRange };
