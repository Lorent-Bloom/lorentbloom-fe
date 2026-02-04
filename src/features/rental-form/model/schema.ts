import { z } from "zod";

export const RentalFormSchema = z
  .object({
    rental_start_date: z.string().min(1, "Start date is required"),
    rental_end_date: z.string().min(1, "End date is required"),
    quantity: z
      .number()
      .int()
      .min(1, "Quantity must be at least 1")
      .max(100, "Quantity cannot exceed 100"),
    status: z.enum(["active", "completed", "cancelled"]),
  })
  .refine(
    (data) => new Date(data.rental_end_date) > new Date(data.rental_start_date),
    {
      message: "End date must be after start date",
      path: ["rental_end_date"],
    },
  );

export type TRentalFormSchema = z.infer<typeof RentalFormSchema>;
