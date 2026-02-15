"use client";

import { useTranslations } from "next-intl";
import type { Feature } from "../model/interface";

export const useRentalInfo = () => {
  const t = useTranslations("rental-info");

  const features: Feature[] = [
    {
      title: t("features.0.title"),
      description: t("features.0.description"),
    },
    {
      title: t("features.1.title"),
      description: t("features.1.description"),
    },
    {
      title: t("features.2.title"),
      description: t("features.2.description"),
    },
  ];

  return {
    badge: t("badge"),
    title: t("title"),
    subtitle: t("subtitle"),
    features,
  };
};
