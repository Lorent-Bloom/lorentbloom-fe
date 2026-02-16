"use client";

import { useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";

export const useHomeHeroCTA = () => {
  const t = useTranslations("home-hero");
  const locale = useLocale();

  const handleRentClick = useCallback(() => {
    const el = document.getElementById("category-showcase");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  return {
    rentCta: t("rent.cta"),
    lendCta: t("lend.cta"),
    lendHref: `/${locale}/account/my-products`,
    handleRentClick,
  };
};
