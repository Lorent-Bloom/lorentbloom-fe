import type { OrderDetail } from "@entities/order";

export interface OrderDetailPageProps {
  order: OrderDetail;
  isRentalOrder?: boolean;
}
