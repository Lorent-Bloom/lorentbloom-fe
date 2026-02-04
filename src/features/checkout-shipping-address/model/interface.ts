import type { CustomerAddress } from "@entities/customer-address";

export interface SavedShippingAddressSelectorProps {
  addresses: CustomerAddress[];
  selectedAddressId?: number;
  onSelectAddress: (addressId: number | null) => void;
  onAddressUpdated?: () => void;
  locale: string;
  className?: string;
}

export interface ShippingAddressFormProps {
  onSubmit: (data: ShippingAddressFormData) => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
}

export interface ShippingAddressFormData {
  firstname: string;
  lastname: string;
  street: string[];
  city: string;
  region?: string;
  regionId?: number;
  postcode: string;
  countryCode: string;
  telephone: string;
}
