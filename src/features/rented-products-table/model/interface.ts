import type { RentedProductsResult } from "@entities/rented-product";

export interface RentedProductsTableProps {
  initialData: RentedProductsResult;
  locale: string;
}

export interface RentalActionsDropdownProps {
  rental: {
    id: string;
    product_url_key: string;
    status: "active" | "completed" | "cancelled";
  };
  locale: string;
}
