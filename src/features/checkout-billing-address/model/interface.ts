import type { CustomerAddress } from "@entities/customer-address";

export interface SavedAddressSelectorProps {
  addresses: CustomerAddress[];
  selectedAddressId?: number;
  onSelectAddress: (addressId: number | null) => void;
  onAddressUpdated?: () => void;
  locale: string;
  className?: string;
}

export interface BillingAddressFormProps {
  onSubmit: (data: BillingAddressFormData) => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
}

export interface BillingAddressFormData {
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
