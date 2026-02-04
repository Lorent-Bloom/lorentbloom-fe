import { z } from "zod";

export const signatureSchema = z.object({
  signatureData: z.string().min(1, "Signature is required"),
  method: z.enum(["draw", "type", "upload", "camera"]),
});

export type TSignatureSchema = z.infer<typeof signatureSchema>;

export const contractSigningSchema = z.object({
  signature: signatureSchema,
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms to proceed",
  }),
});

export type TContractSigningSchema = z.infer<typeof contractSigningSchema>;
