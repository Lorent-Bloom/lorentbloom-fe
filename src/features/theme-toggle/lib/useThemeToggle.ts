"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

export const useThemeToggle = () => {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const t = useTranslations("theme-toggle");

  const themeOptions = [
    { value: "light", label: t("light") },
    { value: "dark", label: t("dark") },
    { value: "system", label: t("system") },
  ] as const;

  return {
    theme,
    resolvedTheme,
    setTheme,
    themeOptions,
  };
};
