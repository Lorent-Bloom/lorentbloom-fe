import { z } from "zod";

export const SignUpFormSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(3, { message: "Password must be at least 3 characters." }),
  firstname: z.string().min(1, { message: "First name is required." }),
  lastname: z.string().min(1, { message: "Last name is required." }),
});

export type TSignUpFormSchema = z.infer<typeof SignUpFormSchema>;
