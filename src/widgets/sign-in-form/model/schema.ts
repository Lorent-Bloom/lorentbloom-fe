import { z } from "zod";

export const SignInFormSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Enter correct password" }),
});

export type TSignInFormSchema = z.infer<typeof SignInFormSchema>;
