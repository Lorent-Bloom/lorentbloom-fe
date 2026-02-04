"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { User, Mail, Shield, MapPin } from "lucide-react";
import type { UseSettingsSidebarProps } from "../model/interface";

export const useSettingsSidebar = ({ locale }: UseSettingsSidebarProps) => {
  const pathname = usePathname();
  const t = useTranslations("settings-sidebar");

  const navItems = [
    {
      href: `/${locale}/account-settings/profile`,
      label: t("profile"),
      icon: User,
    },
    {
      href: `/${locale}/account-settings/account`,
      label: t("account"),
      icon: Mail,
    },
    {
      href: `/${locale}/account-settings/addresses`,
      label: t("addresses"),
      icon: MapPin,
    },
    {
      href: `/${locale}/account-settings/security`,
      label: t("security"),
      icon: Shield,
    },
  ];

  return {
    pathname,
    navItems,
  };
};
