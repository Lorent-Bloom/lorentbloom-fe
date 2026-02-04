import type { TBillingAddressFormSchema } from "./schema";

export const BILLING_ADDRESS_FORM_DEFAULT_VALUES: TBillingAddressFormSchema = {
  firstname: "",
  lastname: "",
  company: "",
  street: ["", ""],
  city: "Chisinau",
  region: "",
  postcode: "MD-2000",
  countryCode: "MD",
  telephone: "",
};
