"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { format } from "date-fns";
import { addToCart } from "@entities/cart";
import type { TAddToCartFormSchema } from "../model/schema";

// Format date to YYYY-MM-DD for the GraphQL API
const formatDateForApi = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

export const useAddToCart = (_productId: number, productSku: string) => {
  const router = useRouter();
  const t = useTranslations("add-to-cart");
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleAddToCart = async (
    values: TAddToCartFormSchema,
    onSuccess?: () => void,
  ) => {
    startTransition(async () => {
      const fromDate = formatDateForApi(values.startDate);
      const toDate = formatDateForApi(values.endDate);

      const cartItemInput = {
        sku: productSku,
        quantity: values.quantity,
        selected_options: values.selectedOptions,
        rent_from_date: fromDate,
        rent_to_date: toDate,
      };

      const result = await addToCart({
        cartItems: [cartItemInput],
      });

      if (!result.success) {
        if (result.error === "SESSION_EXPIRED") {
          toast.error(t("sessionExpired"));
          router.push("/sign-in");
        } else {
          toast.error(result.error || t("failedToAdd"));
        }
        return;
      }

      toast.success(t("addedSuccessfully"));
      setIsOpen(false);
      router.refresh();

      // Call onSuccess callback after successful add to cart
      if (onSuccess) {
        onSuccess();
      }
    });
  };

  return {
    isOpen,
    setIsOpen,
    handleAddToCart,
    isPending,
  };
};
