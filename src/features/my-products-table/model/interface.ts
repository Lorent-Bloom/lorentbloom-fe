import type {
  CustomerProductsResult,
  CustomerProduct,
} from "@entities/customer-product";

export interface MyProductsTableProps {
  initialData: CustomerProductsResult;
  locale: string;
  includeDisabled: boolean;
  onEdit: (product: CustomerProduct) => void;
  onCreateClick: () => void;
  onIncludeDisabledChange: (includeDisabled: boolean) => void;
}

export interface ProductActionsDropdownProps {
  product: CustomerProduct;
  locale: string;
  onEdit: (product: CustomerProduct) => void;
}
