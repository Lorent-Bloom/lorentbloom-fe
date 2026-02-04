import { z } from "zod";

export const ShippingAddressFormSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  street: z.tuple([
    z.string().min(1, "Street address is required"),
    z.string().optional(),
  ]),
  city: z.string().min(1, "City is required"),
  region: z.string().optional(),
  regionId: z.number().optional(),
  postcode: z.string().min(1, "Postal code is required"),
  countryCode: z.string().min(2, "Country is required"),
  telephone: z.string().min(1, "Phone number is required"),
});

export type TShippingAddressFormSchema = z.infer<
  typeof ShippingAddressFormSchema
>;
