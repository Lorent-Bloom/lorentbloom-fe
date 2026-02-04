"use client";

import { useTranslations } from "next-intl";
import {
  User,
  Package,
  Calendar,
  Users,
  FileText,
  MapPin,
  Settings,
  Building2,
} from "lucide-react";
import { handleLogout } from "./action";

interface UseUserAvatarProps {
  customerName: string;
  locale: string;
}

export const useUserAvatar = ({ customerName, locale }: UseUserAvatarProps) => {
  const t = useTranslations("user-avatar");

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const onLogout = async () => {
    await handleLogout(locale);
  };

  const navItems = [
    {
      href: `/${locale}/account`,
      label: t("myAccount"),
      icon: User,
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
      icon: Building2,
    },
  ];

  return {
    t,
    customerName,
    locale,
    getInitials,
    onLogout,
    navItems,
  };
};
