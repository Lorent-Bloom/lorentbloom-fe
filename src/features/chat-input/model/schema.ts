import { z } from "zod";

export const chatMessageSchema = z
  .object({
    content: z.string().max(5000).optional(),
    imageKeys: z.array(z.string()).max(5).optional(),
  })
  .refine(
    (data) =>
      (data.content && data.content.trim().length > 0) ||
      (data.imageKeys && data.imageKeys.length > 0),
    { message: "Message must have content or images" },
  );

export type TChatMessageSchema = z.infer<typeof chatMessageSchema>;
