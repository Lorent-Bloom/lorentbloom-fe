import { z } from "zod";

export const ImageFileSchema = z.object({
  id: z.string(),
  file: z.custom<File>().nullable(),
  preview: z.string(),
  position: z.number(),
  is_main: z.boolean(),
  base64: z.string().optional(),
});

export type TImageFileSchema = z.infer<typeof ImageFileSchema>;
