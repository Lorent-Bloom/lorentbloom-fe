import { z } from "zod";

export const RentalDateSchema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type TRentalDateSchema = z.infer<typeof RentalDateSchema>;
