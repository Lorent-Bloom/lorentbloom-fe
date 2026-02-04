"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AddressSchema, type TAddressSchema } from "../model/schema";
import { ADDRESS_FORM_DEFAULT_VALUES } from "../model/const";
import {
  createCustomerAddress,
  updateCustomerAddress,
  type CustomerAddress,
} from "@entities/customer-address";
import { clearExpiredToken } from "@entities/customer";
import { useRecaptcha, verifyRecaptcha } from "@shared/lib/recaptcha";

interface UseAddressFormProps {
  address?: CustomerAddress | null;
  locale: string;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const useAddressForm = ({
  address,
  locale,
  onOpenChange,
  onSuccess,
}: UseAddressFormProps) => {
  const t = useTranslations("address-management");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { executeRecaptcha } = useRecaptcha();

  const form = useForm<TAddressSchema>({
    resolver: zodResolver(AddressSchema),
    defaultValues: ADDRESS_FORM_DEFAULT_VALUES,
    mode: "onChange",
  });

  useEffect(() => {
    if (address) {
      form.reset(
        {
          firstname: address.firstname,
          lastname: address.lastname,
          company: address.company || "",
          street: address.street as [string?, string?],
          city: address.city,
          postcode: address.postcode,
          country_code: address.country_code,
          telephone: address.telephone,
          default_shipping: address.default_shipping,
          default_billing: address.default_billing,
        },
        { keepDefaultValues: false },
      );
    } else {
      form.reset(ADDRESS_FORM_DEFAULT_VALUES, { keepDefaultValues: false });
    }
  }, [address, form]);

  const onSubmit = async (data: TAddressSchema) => {
    setIsSubmitting(true);
    try {
      const recaptchaToken = await executeRecaptcha("address_form");
      const recaptchaResult = await verifyRecaptcha(recaptchaToken, "address_form");
      if (!recaptchaResult.success) {
        toast.error("Verification failed. Please try again.");
        return;
      }

      // Transform form data to match API input format
      const addressInput = {
        firstname: data.firstname,
        lastname: data.lastname,
        company: data.company,
        street: data.street.filter(Boolean) as string[],
        city: data.city,
        region: { region: data.city },
        postcode: data.postcode,
        country_code: data.country_code,
        telephone: data.telephone,
        default_shipping: data.default_shipping,
        default_billing: data.default_billing,
      };

      const result = address
        ? await updateCustomerAddress(address.id, addressInput)
        : await createCustomerAddress(addressInput);

      if (result.success) {
        toast.success(
          address ? t("addressUpdatedSuccess") : t("addressCreatedSuccess"),
        );
        onOpenChange(false);
        onSuccess();
      } else {
        if (result.error === "SESSION_EXPIRED") {
          await clearExpiredToken();
          toast.error(t("sessionExpired"));
          router.push(`/${locale}/sign-in`);
        } else {
          console.error("Address submission error:", result.error);
          toast.error(result.error || t("addressError"));
        }
      }
    } catch (error) {
      console.error("Address submission exception:", error);
      toast.error(t("addressError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { form, onSubmit, isSubmitting, t, address };
};
