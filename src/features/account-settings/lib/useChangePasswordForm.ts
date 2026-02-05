"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ChangePasswordSchema,
  type TChangePasswordSchema,
} from "../model/schema";
import type { UseChangePasswordFormProps } from "../model/interface";
import { changeCustomerPassword, clearExpiredToken } from "@entities/customer";
import { useRecaptcha, verifyRecaptcha } from "@shared/lib/recaptcha";

export const useChangePasswordForm = ({
  locale,
}: UseChangePasswordFormProps) => {
  const t = useTranslations("account-settings");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { executeRecaptcha } = useRecaptcha();

  const form = useForm<TChangePasswordSchema>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: TChangePasswordSchema) => {
    setIsSubmitting(true);
    try {
      const recaptchaToken = await executeRecaptcha("change_password");
      const recaptchaResult = await verifyRecaptcha(
        recaptchaToken,
        "change_password",
      );
      if (!recaptchaResult.success) {
        toast.error("Verification failed. Please try again.");
        return;
      }

      const result = await changeCustomerPassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (result.success) {
        toast.success(t("passwordChangedSuccess"));
        form.reset();
      } else {
        if (result.error === "SESSION_EXPIRED") {
          await clearExpiredToken();
          toast.error(t("sessionExpired"));
          router.push(`/${locale}/sign-in`);
        } else {
          toast.error(result.error || t("passwordChangedError"));
        }
      }
    } catch {
      toast.error(t("passwordChangedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { form, onSubmit, isSubmitting, t };
};
