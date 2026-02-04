import type { CustomerAddress } from "@entities/customer-address";

export interface AddressFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: CustomerAddress | null;
  onSuccess: () => void;
  locale: string;
}

export interface AddressCardProps {
  address: CustomerAddress;
  onEdit: (address: CustomerAddress) => void;
  onDelete: (id: number) => void;
}

export interface AddressListProps {
  addresses: CustomerAddress[];
  locale: string;
}
