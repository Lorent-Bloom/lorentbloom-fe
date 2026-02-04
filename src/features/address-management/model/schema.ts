import { z } from "zod";

export const AddressSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  street: z.tuple([
    z.string().min(1, "Street address is required"),
    z.string().optional(),
  ]),
  city: z.string().min(1, "City is required"),
  postcode: z.string().min(1, "Postal code is required"),
  country_code: z.string().min(2, "Country is required").max(2),
  telephone: z.string().min(1, "Phone number is required"),
  default_shipping: z.boolean().optional(),
  default_billing: z.boolean().optional(),
});

export type TAddressSchema = z.infer<typeof AddressSchema>;
