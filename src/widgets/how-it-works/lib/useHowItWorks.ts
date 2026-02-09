"use client";

import { useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type { Step } from "../model/interface";

export const useHowItWorks = () => {
  const t = useTranslations("how-it-works");
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const steps: Step[] = [
    {
      number: 1,
      title: t("steps.0.title"),
      description: t("steps.0.description"),
    },
    {
      number: 2,
      title: t("steps.1.title"),
      description: t("steps.1.description"),
    },
    {
      number: 3,
      title: t("steps.2.title"),
      description: t("steps.2.description"),
    },
  ];

  const listSteps: Step[] = [
    {
      number: 1,
      title: t("listSteps.0.title"),
      description: t("listSteps.0.description"),
    },
    {
      number: 2,
      title: t("listSteps.1.title"),
      description: t("listSteps.1.description"),
    },
    {
      number: 3,
      title: t("listSteps.2.title"),
      description: t("listSteps.2.description"),
    },
  ];

  const handleGetStarted = useCallback(() => {
    router.push(`/${locale}/products`);
  }, [router, locale]);

  return {
    title: t("title"),
    subtitle: t("subtitle"),
    tabRent: t("tabRent"),
    tabList: t("tabList"),
    steps,
    listSteps,
    ctaText: t("cta"),
    handleGetStarted,
  };
};
