export interface GetRentedProductsInput {
  page?: number;
  pageSize?: number;
}

export interface UpdateRentalInput {
  id: string;
  rental_start_date: string;
  rental_end_date: string;
  quantity: number;
  status: "active" | "completed" | "cancelled";
}
