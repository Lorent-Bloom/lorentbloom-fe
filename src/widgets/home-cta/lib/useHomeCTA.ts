"use client";

import { useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export const useHomeCTA = () => {
  const t = useTranslations("home-cta");
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const handleBrowseClick = useCallback(() => {
    router.push(`/${locale}/products`);
  }, [router, locale]);

  const handleSignUpClick = useCallback(() => {
    router.push(`/${locale}/sign-up`);
  }, [router, locale]);

  return {
    title: t("title"),
    subtitle: t("subtitle"),
    primaryCta: t("primaryCta"),
    secondaryCta: t("secondaryCta"),
    features: [t("features.0"), t("features.1"), t("features.2")],
    handleBrowseClick,
    handleSignUpClick,
  };
};
