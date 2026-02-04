export interface CreateProductReservationInput {
  product_id: number;
  from_date: string;
  to_date: string;
}

export interface ActionResponse<T> {
  success: boolean;
  error?: string;
  data?: T;
}
