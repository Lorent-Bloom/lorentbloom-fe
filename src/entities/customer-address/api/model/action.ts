import { CustomerAddress } from "./entity";

export interface CustomerAddressInput {
  firstname?: string;
  lastname?: string;
  company?: string;
  street?: string[];
  city?: string;
  region?: { region: string };
  postcode?: string;
  country_code?: string;
  telephone?: string;
  default_shipping?: boolean;
  default_billing?: boolean;
}

export interface CreateCustomerAddressResponse {
  createCustomerAddress: CustomerAddress;
}

export interface UpdateCustomerAddressResponse {
  updateCustomerAddress: CustomerAddress;
}

export interface DeleteCustomerAddressResponse {
  deleteCustomerAddress: boolean;
}

export interface GetCustomerAddressesResponse {
  customer: {
    addresses: CustomerAddress[];
  };
}
