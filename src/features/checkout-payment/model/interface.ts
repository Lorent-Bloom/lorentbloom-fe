export interface PaymentMethodSelectorProps {
  cartId: string;
  selectedMethod: string | null;
  onMethodSelected: (methodCode: string) => void;
  className?: string;
}
