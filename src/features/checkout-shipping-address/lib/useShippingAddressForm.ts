"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShippingAddressFormSchema,
  type TShippingAddressFormSchema,
} from "../model/schema";
import { SHIPPING_ADDRESS_FORM_DEFAULT_VALUES } from "../model/const";
import type { ShippingAddressFormData } from "../model/interface";

export const useShippingAddressForm = (
  onSubmit: (data: ShippingAddressFormData) => Promise<void>,
  isSubmitting: boolean = false,
) => {
  const form = useForm<TShippingAddressFormSchema>({
    resolver: zodResolver(ShippingAddressFormSchema),
    defaultValues: SHIPPING_ADDRESS_FORM_DEFAULT_VALUES,
  });

  const handleSubmit = async (values: TShippingAddressFormSchema) => {
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
