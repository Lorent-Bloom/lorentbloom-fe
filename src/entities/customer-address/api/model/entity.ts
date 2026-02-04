export interface CustomerRegion {
  region: string;
  region_code: string;
}

export interface CustomerAddress {
  id: number;
  firstname: string;
  lastname: string;
  company?: string;
  street: string[];
  city: string;
  region: CustomerRegion;
  postcode: string;
  country_code: string;
  telephone: string;
  default_shipping: boolean;
  default_billing: boolean;
}
