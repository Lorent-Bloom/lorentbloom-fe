"use client";

import { useState } from "react";
import { confirmEmail } from "@entities/customer";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface UseConfirmEmailParams {
  email: string;
  confirmationKey: string;
}

export const useConfirmEmail = ({
  email,
  confirmationKey,
}: UseConfirmEmailParams) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("confirm-email.errors");

  const getErrorMessage = (errorMsg: string): string => {
    const lowerError = errorMsg.toLowerCase();
    if (lowerError.includes("expired") || lowerError.includes("invalid key")) {
      return t("linkExpired");
    }
    if (
      lowerError.includes("already confirmed") ||
      lowerError.includes("already active")
    ) {
      return t("alreadyConfirmed");
    }
    if (
      lowerError.includes("not found") ||
      lowerError.includes("no customer")
    ) {
      return t("customerNotFound");
    }
    return t("unknownError");
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await confirmEmail({
        email,
        confirmation_key: confirmationKey,
      });

      if (result.success) {
        setIsSuccess(true);
        toast.success(t("successToast"));
      } else {
        const errorMessage = getErrorMessage(result.error || "");
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch {
      const errorMessage = t("unknownError");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleConfirm,
    isLoading,
    isSuccess,
    error,
  };
};
