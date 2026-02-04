import { z } from "zod";

export const ChatReportSchema = z.object({
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be at most 2000 characters"),
});

export type TChatReportSchema = z.infer<typeof ChatReportSchema>;
