import { useTranslations } from "next-intl";
import type { BreadcrumbItem } from "../model/interface";

interface UseBreadcrumbProps {
  locale: string;
  customItems?: BreadcrumbItem[];
}

export const useBreadcrumb = ({ locale, customItems }: UseBreadcrumbProps) => {
  const t = useTranslations("breadcrumb");

  // If custom items are provided, use them
  if (customItems) {
    return customItems;
  }

  // Default: just home
  return [
    {
      label: t("home"),
      href: `/${locale}`,
    },
  ];
};
