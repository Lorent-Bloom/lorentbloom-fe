"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ContactFormSchema, type TContactFormSchema } from "../model/schema";
import { CONTACT_FORM_DEFAULT_VALUES } from "../model/const";
import { submitContactForm } from "../api/action/server";
import { useRecaptcha } from "@shared/lib/recaptcha";

interface UseContactFormProps {
  defaultName?: string;
  defaultEmail?: string;
}

export const useContactForm = ({
  defaultName,
  defaultEmail,
}: UseContactFormProps = {}) => {
  const t = useTranslations("contact-form");
  const locale = useLocale();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { executeRecaptcha } = useRecaptcha();

  const form = useForm<TContactFormSchema>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      ...CONTACT_FORM_DEFAULT_VALUES,
      name: defaultName || "",
      email: defaultEmail || "",
    },
  });

  const onFormSubmit = async (values: TContactFormSchema) => {
    setIsSubmitting(true);
    try {
      const recaptchaToken = await executeRecaptcha("contact_form");
      const result = await submitContactForm(values, recaptchaToken);

      if (result.success) {
        toast.success(t("success"));
        router.push(`/${locale}`);
      } else {
        toast.error(result.error || t("error"));
      }
    } catch {
      toast.error(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { form, onFormSubmit, isSubmitting };
};
