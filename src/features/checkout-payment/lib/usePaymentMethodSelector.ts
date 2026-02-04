"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  getAvailablePaymentMethods,
  type PaymentMethod,
} from "@entities/payment";

export const usePaymentMethodSelector = (cartId: string) => {
  const t = useTranslations("checkout-payment");
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMethods = async () => {
      setIsLoading(true);
      setError(null);

      const result = await getAvailablePaymentMethods(cartId);

      if (result.success && result.data) {
        setMethods(result.data);
      } else {
        setError(result.error || t("failedToLoad"));
      }

      setIsLoading(false);
    };

    if (cartId) {
      fetchMethods();
    }
  }, [cartId, t]);

  return { methods, isLoading, error };
};
