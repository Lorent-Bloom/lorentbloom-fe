import type { ConfigurableProductOption, Reservation } from "@entities/product";

export interface AddToCartButtonProps {
  productId: number;
  productSku: string;
  productName: string;
  productUrlKey: string;
  initialQuantity?: number;
  className?: string;
  configurableOptions?: ConfigurableProductOption[];
  reservations?: Reservation[];
  productQuantity?: number;
}

export interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productSku: string;
  productName: string;
  initialQuantity?: number;
  configurableOptions?: ConfigurableProductOption[];
  reservations?: Reservation[];
  productQuantity?: number;
}

export interface ConfigurableOptionsSelectorProps {
  options: ConfigurableProductOption[];
  selectedOptions: Record<string, string>;
  onOptionChange: (optionUid: string, valueUid: string) => void;
}
