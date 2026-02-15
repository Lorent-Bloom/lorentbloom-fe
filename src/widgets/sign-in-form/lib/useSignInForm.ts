"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SignInFormSchema, type TSignInFormSchema } from "../model/schema";
import { signInCustomer } from "@entities/customer";
import { useRecaptcha } from "@shared/lib/recaptcha";
import { verifyRecaptcha } from "@shared/lib/recaptcha";
import { SIGN_IN_FORM_DEFAULT_VALUES } from "../model/const";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const useSignInForm = () => {
  const { executeRecaptcha } = useRecaptcha();
  const form = useForm<TSignInFormSchema>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: SIGN_IN_FORM_DEFAULT_VALUES,
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("sign-in-form.errors");

  const getErrorMessage = (error: string): string => {
    // Map common GraphQL error messages to translation keys
    if (
      error.includes("The account sign-in was incorrect") ||
      error.includes("Invalid login or password")
    ) {
      return t("invalidCredentials");
    }
    if (error.includes("account is locked") || error.includes("locked")) {
      return t("accountLocked");
    }
    if (error.includes("not confirmed") || error.includes("not activated")) {
      return t("accountNotConfirmed");
    }
    if (error === "NO_TOKEN_RECEIVED") {
      return t("noTokenReceived");
    }
    if (error.includes("network") || error.includes("NetworkError")) {
      return t("networkError");
    }

    // Default error message
    return t("unknownError");
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onFormSubmit = async (values: TSignInFormSchema) => {
    setIsSubmitting(true);
    try {
      const recaptchaToken = await executeRecaptcha("sign_in");
      const recaptchaResult = await verifyRecaptcha(recaptchaToken, "sign_in");
      if (!recaptchaResult.success) {
        toast.error("Verification failed. Please try again.");
        return;
      }

      const result = await signInCustomer({
        email: values.email,
        password: values.password,
      });

      if (result.success) {
        toast.success(t("success"));
        form.reset(SIGN_IN_FORM_DEFAULT_VALUES);

        const redirectUrl = searchParams?.get("redirect");
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push("/account");
        }
      } else {
        const errorMessage = result.error
          ? getErrorMessage(result.error)
          : t("unknownError");
        toast.error(errorMessage);
      }
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
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [form]);

  return { form, onFormSubmit, loading: isSubmitting };
};
