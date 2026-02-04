"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export const useCheckoutFailedPage = (error?: string) => {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("checkout-failed");

  // Extract locale from pathname
  const locale = pathname?.split("/")[1] || "en";

  const handleRetry = () => {
    router.push(`/${locale}/checkout`);
  };

  const handleBackToCart = () => {
    router.push(`/${locale}/cart`);
  };

  return {
    error: error || t("defaultError"),
    handleRetry,
    handleBackToCart,
  };
};
