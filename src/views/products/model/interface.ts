import type { ProductsResult } from "@entities/product";

export interface ProductsPageProps {
  data: ProductsResult | null;
  error: string | null;
  searchParams: {
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  };
}
