import type { TShippingAddressFormSchema } from "./schema";

export const SHIPPING_ADDRESS_FORM_DEFAULT_VALUES: TShippingAddressFormSchema =
  {
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
