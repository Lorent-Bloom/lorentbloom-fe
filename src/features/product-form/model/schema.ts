import { z } from "zod";
import { ImageFileSchema } from "@features/multi-image-upload";

// is_active: 1 = Active, 2 = Disabled
export const ProductFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(255),
  description: z.string().min(1, { message: "Description is required" }),
  short_description: z
    .string()
    .min(1, { message: "Short description is required" })
    .max(500),
  // Category fields - only category is required, others are optional
  category_id: z.string().min(1, { message: "Category is required" }),
  subcategory_id: z.string(),
  sub_subcategory_id: z.string(),
  city: z.string().min(1, { message: "City is required" }),
  manufacturer: z.string().optional(),
  price: z.number().min(0, { message: "Price must be at least 0" }),
  quantity: z.number().int().min(0, { message: "Quantity must be at least 0" }),
  images: z
    .array(ImageFileSchema)
    .min(1, { message: "At least one image is required" }),
  is_active: z.union([z.literal(1), z.literal(2)]),
});

export type TProductFormSchema = z.infer<typeof ProductFormSchema>;
