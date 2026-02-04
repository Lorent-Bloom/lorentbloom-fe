import { z } from "zod";

export const WriteReviewFormSchema = z.object({
  nickname: z.string().min(1, "Name is required").max(50, "Name is too long"),
  summary: z
    .string()
    .min(1, "Summary is required")
    .max(100, "Summary is too long"),
  text: z.string().min(10, "Review must be at least 10 characters"),
  // Overall rating (1-5 stars)
  overallRating: z
    .number()
    .min(1, "Please provide a rating")
    .max(5, "Rating must be between 1 and 5"),
  // Ratings will be dynamic based on metadata from backend
  ratings: z.record(z.string(), z.string().min(1, "Please select a rating")),
});

export type TWriteReviewFormSchema = z.infer<typeof WriteReviewFormSchema>;
