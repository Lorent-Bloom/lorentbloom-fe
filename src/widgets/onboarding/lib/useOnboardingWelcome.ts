"use client";

import { useTranslations } from "next-intl";

export const useOnboardingWelcome = () => {
  const t = useTranslations("onboarding");
  return { t };
};
