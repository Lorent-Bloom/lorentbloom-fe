import { z } from "zod";

export const CompanySettingsSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyPhone: z.string().min(1, "Company phone is required"),
  companyLogo: z.string().optional(),
});

export type TCompanySettingsSchema = z.infer<typeof CompanySettingsSchema>;
