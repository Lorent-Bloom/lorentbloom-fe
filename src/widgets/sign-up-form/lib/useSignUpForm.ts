"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignUpFormSchema, type TSignUpFormSchema } from "../model/schema";
import { createCustomer } from "@entities/customer";
import { SIGN_UP_FORM_DEFAULT_VALUES } from "../model/const";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRecaptcha, verifyRecaptcha } from "@shared/lib/recaptcha";

export const useSignUpForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { executeRecaptcha } = useRecaptcha();

  const form = useForm<TSignUpFormSchema>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: SIGN_UP_FORM_DEFAULT_VALUES,
  });
  const t = useTranslations("sign-up-form.errors");

  const getErrorMessage = (error: Error | string): string => {
    const errorMessage =
      typeof error === "string" ? error : error?.message || String(error);

    // Map common GraphQL error messages to translation keys
    if (
      errorMessage.includes("already exists") ||
      errorMessage.includes("already registered") ||
      errorMessage.includes(
        "A customer with the same email address already exists",
      )
    ) {
      return t("emailExists");
    }
    if (
      errorMessage.includes("password") ||
      errorMessage.includes("Password") ||
      errorMessage.includes("classes of characters")
    ) {
      // Return the actual error message for password issues since they vary
      return errorMessage;
    }
    if (
      errorMessage.includes("email") &&
      (errorMessage.includes("invalid") || errorMessage.includes("format"))
    ) {
      return t("invalidEmail");
    }
    if (
      errorMessage.includes("network") ||
      errorMessage.includes("NetworkError")
    ) {
      return t("networkError");
    }
    if (
      errorMessage.includes("firstname") ||
      errorMessage.includes("first name")
    ) {
      return t("invalidFirstname");
    }
    if (
      errorMessage.includes("lastname") ||
      errorMessage.includes("last name")
    ) {
      return t("invalidLastname");
    }

    // Default error message
    return t("unknownError");
  };

  const onFormSubmit = async (values: TSignUpFormSchema) => {
    setIsSubmitting(true);
    try {
      const recaptchaToken = await executeRecaptcha("sign_up");
      const recaptchaResult = await verifyRecaptcha(recaptchaToken, "sign_up");
      if (!recaptchaResult.success) {
        toast.error("Verification failed. Please try again.");
        return;
      }

      // Map form values to API input
      const customerInput = {
        email: values.email,
        password: values.password,
        firstname: values.firstname,
        lastname: values.lastname,
      };

      const result = await createCustomer(customerInput);

      if (!result.success) {
        throw new Error(result.error || "Failed to create customer");
      }

      form.reset(SIGN_UP_FORM_DEFAULT_VALUES);
      setIsSuccess(true);
    } catch (err) {
      // Error is handled and displayed to user via toast
      const errorMessage = getErrorMessage(err as Error);
      setError(err as Error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // TODO: dev only
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        form.reset({
          email: "test@example.com",
          password: "Test1234!",
          firstname: "John",
          lastname: "Doe",
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [form]);

  return {
    form,
    onFormSubmit,
    loading: isSubmitting,
    isSuccess,
    error,
  };
};
