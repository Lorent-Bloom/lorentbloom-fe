import type { ProductDetail } from "@entities/product";

export interface ProductDescriptionProps {
  product: ProductDetail;
  className?: string;
}

export interface VendorInfoProps {
  product: ProductDetail;
}

export interface SpecificationsTableProps {
  attributes: Array<{
    attribute_code: string;
    label: string;
    value: string;
  }>;
}
