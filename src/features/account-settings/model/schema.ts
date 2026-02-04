import { z } from "zod";

export const UpdateNameSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
});

export const UpdateEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required to change email"),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type TUpdateNameSchema = z.infer<typeof UpdateNameSchema>;
export type TUpdateEmailSchema = z.infer<typeof UpdateEmailSchema>;
export type TChangePasswordSchema = z.infer<typeof ChangePasswordSchema>;
