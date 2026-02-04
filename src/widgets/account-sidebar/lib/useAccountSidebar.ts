"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Home,
  Package,
  Calendar,
  Users,
  MapPin,
  Settings,
  Building,
  FileText,
} from "lucide-react";
import type { UseAccountSidebarProps } from "../model/interface";

export const useAccountSidebar = ({ locale }: UseAccountSidebarProps) => {
  const pathname = usePathname();
  const t = useTranslations("account-sidebar");

  const navItems = [
    {
      href: `/${locale}/account`,
      label: t("myAccount"),
      icon: Home,
    },
    {
      href: `/${locale}/account/my-products`,
      label: t("myProducts"),
      icon: Package,
    },
    {
      href: `/${locale}/account/my-rents`,
      label: t("myRents"),
      icon: Calendar,
    },
    {
      href: `/${locale}/account/my-product-rentals`,
      label: t("myProductRentals"),
      icon: Users,
    },
    {
      href: `/${locale}/account/documents`,
      label: t("documents"),
      icon: FileText,
    },
    {
      href: `/${locale}/account/addresses`,
      label: t("addresses"),
      icon: MapPin,
    },
    {
      href: `/${locale}/account/settings`,
      label: t("settings"),
      icon: Settings,
    },
    {
      href: `/${locale}/account/company`,
      label: t("company"),
      icon: Building,
    },
  ];

  return {
    pathname,
    navItems,
  };
};
