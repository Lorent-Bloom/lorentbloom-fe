"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import {
  updateCustomerAttributes,
  buildCustomAttributesInput,
} from "@entities/customer";
import {
  CompanySettingsSchema,
  type TCompanySettingsSchema,
} from "../model/schema";
import type { UseCompanySettingsProps } from "../model/interface";
import { useRecaptcha, verifyRecaptcha } from "@shared/lib/recaptcha";

export const useCompanySettings = ({
  defaultValues,
}: UseCompanySettingsProps) => {
  const router = useRouter();
  const t = useTranslations("company-settings");
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { executeRecaptcha } = useRecaptcha();

  const form = useForm<TCompanySettingsSchema>({
    resolver: zodResolver(CompanySettingsSchema),
    defaultValues: {
      companyName: defaultValues?.companyName || "",
      companyPhone: defaultValues?.companyPhone || "",
      companyLogo: defaultValues?.companyLogo || "",
    },
  });

  const onSubmit = async (values: TCompanySettingsSchema) => {
    setIsSubmitting(true);

    try {
      const recaptchaToken = await executeRecaptcha("company_settings");
      const recaptchaResult = await verifyRecaptcha(
        recaptchaToken,
        "company_settings",
      );
      if (!recaptchaResult.success) {
        toast.error("Verification failed. Please try again.");
        return;
      }

      const customAttributes = buildCustomAttributesInput({
        company: values.companyName,
        company_phone: values.companyPhone,
        company_logo: values.companyLogo || "",
      });

      const result = await updateCustomerAttributes({
        custom_attributes: customAttributes,
      });

      if (!result.success) {
        if (result.error === "SESSION_EXPIRED") {
          router.push(`/${locale}/sign-in`);
          return;
        }
        toast.error(t("error"));
        return;
      }

      toast.success(t("success"));
      router.refresh();
    } catch {
      toast.error(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting,
    t,
  };
};
