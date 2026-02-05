"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UpdateNameSchema, type TUpdateNameSchema } from "../model/schema";
import type { UseUpdateNameFormProps } from "../model/interface";
import { updateCustomerName, clearExpiredToken } from "@entities/customer";
import { useRecaptcha, verifyRecaptcha } from "@shared/lib/recaptcha";

export const useUpdateNameForm = ({
  defaultValues,
  locale,
}: UseUpdateNameFormProps) => {
  const t = useTranslations("account-settings");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { executeRecaptcha } = useRecaptcha();

  const form = useForm<TUpdateNameSchema>({
    resolver: zodResolver(UpdateNameSchema),
    defaultValues,
  });

  const onSubmit = async (data: TUpdateNameSchema) => {
    setIsSubmitting(true);
    try {
      const recaptchaToken = await executeRecaptcha("update_name");
      const recaptchaResult = await verifyRecaptcha(
        recaptchaToken,
        "update_name",
      );
      if (!recaptchaResult.success) {
        toast.error("Verification failed. Please try again.");
        return;
      }

      const result = await updateCustomerName(data);

      if (result.success) {
        toast.success(t("nameUpdatedSuccess"));
      } else {
        if (result.error === "SESSION_EXPIRED") {
          await clearExpiredToken();
          toast.error(t("sessionExpired"));
          router.push(`/${locale}/sign-in`);
        } else {
          toast.error(result.error || t("nameUpdatedError"));
        }
      }
    } catch {
      toast.error(t("nameUpdatedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { form, onSubmit, isSubmitting, t };
};
