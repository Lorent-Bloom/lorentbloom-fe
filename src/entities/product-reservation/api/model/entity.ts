export interface ProductReservation {
  product_id: number;
  from_date: string;
  to_date: string;
}

export interface CreateProductReservationResponse {
  createProductReservation: {
    reservation: ProductReservation;
  };
}
