"use client";

import { useTranslations } from "next-intl";

export const useCompanyInfo = () => {
  const t = useTranslations("company-info");

  const stats = [
    {
      value: t("stats.0.value"),
      label: t("stats.0.label"),
    },
    {
      value: t("stats.1.value"),
      label: t("stats.1.label"),
    },
    {
      value: t("stats.2.value"),
      label: t("stats.2.label"),
    },
    {
      value: t("stats.3.value"),
      label: t("stats.3.label"),
    },
  ];

  const features = [
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
    {
      title: t("features.3.title"),
      description: t("features.3.description"),
    },
  ];

  return {
    aboutTitle: t("about.title"),
    aboutDescription: t("about.description"),
    missionTitle: t("mission.title"),
    missionDescription: t("mission.description"),
    valuesTitle: t("values.title"),
    stats,
    featuresTitle: t("features.title"),
    features,
  };
};
