"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UpdateEmailSchema, type TUpdateEmailSchema } from "../model/schema";
import type { UseUpdateEmailFormProps } from "../model/interface";
import { updateCustomerEmail, clearExpiredToken } from "@entities/customer";
import { useRecaptcha, verifyRecaptcha } from "@shared/lib/recaptcha";

export const useUpdateEmailForm = ({
  currentEmail,
  locale,
}: UseUpdateEmailFormProps) => {
  const t = useTranslations("account-settings");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { executeRecaptcha } = useRecaptcha();

  const form = useForm<TUpdateEmailSchema>({
    resolver: zodResolver(UpdateEmailSchema),
    defaultValues: {
      email: currentEmail,
      password: "",
    },
  });

  const onSubmit = async (data: TUpdateEmailSchema) => {
    setIsSubmitting(true);
    try {
      const recaptchaToken = await executeRecaptcha("update_email");
      const recaptchaResult = await verifyRecaptcha(recaptchaToken, "update_email");
      if (!recaptchaResult.success) {
        toast.error("Verification failed. Please try again.");
        return;
      }

      const result = await updateCustomerEmail(data);

      if (result.success) {
        toast.success(t("emailUpdatedSuccess"));
        form.setValue("password", "");
        router.refresh();
      } else {
        if (result.error === "SESSION_EXPIRED") {
          await clearExpiredToken();
          toast.error(t("sessionExpired"));
          router.push(`/${locale}/sign-in`);
        } else {
          toast.error(result.error || t("emailUpdatedError"));
        }
      }
    } catch {
      toast.error(t("emailUpdatedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { form, onSubmit, isSubmitting, t };
};
