"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BillingAddressFormSchema,
  type TBillingAddressFormSchema,
} from "../model/schema";
import { BILLING_ADDRESS_FORM_DEFAULT_VALUES } from "../model/const";
import type { BillingAddressFormData } from "../model/interface";

export const useBillingAddressForm = (
  onSubmit: (data: BillingAddressFormData) => Promise<void>,
  isSubmitting: boolean = false,
) => {
  const form = useForm<TBillingAddressFormSchema>({
    resolver: zodResolver(BillingAddressFormSchema),
    defaultValues: BILLING_ADDRESS_FORM_DEFAULT_VALUES,
  });

  const handleSubmit = async (values: TBillingAddressFormSchema) => {
    await onSubmit({
      ...values,
      street: values.street.filter((s): s is string => s !== undefined),
    });
  };

  return {
    form,
    handleSubmit,
    isSubmitting,
  };
};
