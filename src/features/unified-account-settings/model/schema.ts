import { z } from "zod";

/**
 * Moldovan IDNP validation (13 digits: 2TTTXXXYYYYYK)
 * - 2: Identifier for natural persons
 * - TTT: Last 3 digits of year IDNP was assigned
 * - XXX: Civil status code
 * - YYYYY: Sequential registration number
 * - K: Check digit
 */
const validateMoldovanIDNP = (value: string): boolean => {
  if (!value) return false;
  const cleaned = value.replace(/\s/g, "");
  if (!/^2\d{12}$/.test(cleaned)) return false;
  return true;
};

/**
 * Moldovan phone validation
 * Supports format: +373 XX XXX XXX (with mask)
 * Mobile prefixes: 60-69, 76-79
 * Landline prefixes: 22, 23, etc.
 */
const validateMoldovanPhone = (value: string): boolean => {
  if (!value) return false;
  const cleaned = value.replace(/[\s\-\(\)]/g, "");
  // +373XXXXXXXX (8 digits after country code)
  if (/^\+373\d{8}$/.test(cleaned)) return true;
  return false;
};

// Individual schemas for each section
export const NameSectionSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  telephone: z
    .string()
    .min(1, "Phone number is required")
    .refine((val) => validateMoldovanPhone(val), {
      message: "Invalid Moldovan phone number",
    }),
  personal_number: z
    .string()
    .min(1, "IDNP is required")
    .refine((val) => validateMoldovanIDNP(val), {
      message: "Invalid IDNP format (must be 13 digits starting with 2)",
    }),
});

export const EmailSectionSchema = z.object({
  email: z.string().email("Invalid email address"),
  currentPasswordForEmail: z
    .string()
    .min(1, "Password is required to change email"),
});

export const PasswordSectionSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Combined schema - all fields optional since controlled by checkboxes
export const UnifiedAccountSettingsSchema = z.object({
  // Name section
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  telephone: z.string().optional(),
  personal_number: z.string().optional(),
  // Email section
  email: z.string().optional(),
  currentPasswordForEmail: z.string().optional(),
  // Password section
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
});

export type TNameSectionSchema = z.infer<typeof NameSectionSchema>;
export type TEmailSectionSchema = z.infer<typeof EmailSectionSchema>;
export type TPasswordSectionSchema = z.infer<typeof PasswordSectionSchema>;
export type TUnifiedAccountSettingsSchema = z.infer<
  typeof UnifiedAccountSettingsSchema
>;
