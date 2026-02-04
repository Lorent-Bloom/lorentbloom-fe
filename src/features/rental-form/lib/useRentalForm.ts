"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { updateRental } from "@entities/rented-product";
import { clearExpiredToken } from "@entities/customer";
import { RentalFormSchema, type TRentalFormSchema } from "../model/schema";
import type { RentalFormProps } from "../model/interface";
import { useRecaptcha, verifyRecaptcha } from "@shared/lib/recaptcha";

export const useRentalForm = ({ rental }: RentalFormProps) => {
  const router = useRouter();
  const t = useTranslations("rental-form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { executeRecaptcha } = useRecaptcha();

  const form = useForm<TRentalFormSchema>({
    resolver: zodResolver(RentalFormSchema),
    defaultValues: {
      rental_start_date: rental.rental_start_date,
      rental_end_date: rental.rental_end_date,
      quantity: rental.quantity,
      status: rental.status,
    },
  });

  const onFormSubmit = async (values: TRentalFormSchema) => {
    setIsSubmitting(true);

    try {
      const recaptchaToken = await executeRecaptcha("rental_form");
      const recaptchaResult = await verifyRecaptcha(recaptchaToken, "rental_form");
      if (!recaptchaResult.success) {
        toast.error("Verification failed. Please try again.");
        return;
      }

      const result = await updateRental({
        id: rental.id,
        rental_start_date: values.rental_start_date,
        rental_end_date: values.rental_end_date,
        quantity: values.quantity,
        status: values.status,
      });

      if (!result.success) {
        if (result.error === "SESSION_EXPIRED") {
          await clearExpiredToken();
          toast.error(t("sessionExpired"));
          const locale = window.location.pathname.split("/")[1];
          router.push(`/${locale}/sign-in`);
          return;
        }

        toast.error(result.error || t("updateFailed"));
        return;
      }

      toast.success(t("updateSuccess"));
      const locale = window.location.pathname.split("/")[1];
      router.push(`/${locale}/rented-products`);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const locale = window.location.pathname.split("/")[1];
    router.push(`/${locale}/rented-products`);
  };

  return {
    form,
    onFormSubmit,
    handleCancel,
    isSubmitting,
    t,
  };
};
