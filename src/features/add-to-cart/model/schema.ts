import { z } from "zod";

export const AddToCartFormSchema = z
  .object({
    quantity: z.number().min(1, "Quantity must be at least 1"),
    startDate: z.date(),
    endDate: z.date(),
    selectedOptions: z.array(z.string()).optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type TAddToCartFormSchema = z.infer<typeof AddToCartFormSchema>;
