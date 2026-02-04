import type { TAddressSchema } from "./schema";

export const ADDRESS_FORM_DEFAULT_VALUES: TAddressSchema = {
  firstname: "",
  lastname: "",
  company: "",
  street: ["", ""],
  city: "Chisinau",
  postcode: "MD-2000",
  country_code: "MD",
  telephone: "",
  default_shipping: false,
  default_billing: false,
};
