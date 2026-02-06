"use client";

import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Breadcrumb from "./Breadcrumb";
import { generateBreadcrumbs } from "../lib/generateBreadcrumbs";

export default function DynamicBreadcrumb() {
  const pathname = usePathname() || "/";
  const locale = useLocale();
  const t = useTranslations("breadcrumb");
  const headerT = useTranslations("header");

  const categoryNames: Record<string, string> =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (headerT.raw as any)("categoryNames") || {};

  const breadcrumbItems = generateBreadcrumbs({
    pathname,
    locale,
    translations: {
      home: t("home"),
      products: t("products"),
      about: t("about"),
      faq: t("faq"),
      howToRentOut: t("howToRentOut"),
      termsOfPolicy: t("termsOfPolicy"),
      accountSettings: t("accountSettings"),
      profile: t("profile"),
      account: t("account"),
      addresses: t("addresses"),
      security: t("security"),
      signIn: t("signIn"),
      signUp: t("signUp"),
    },
    categoryNames,
  });

  // Don't render breadcrumb on home page, sign-in, or sign-up pages
  if (
    breadcrumbItems.length === 0 ||
    pathname.endsWith("/sign-in") ||
    pathname.endsWith("/sign-up")
  ) {
    return null;
  }

  return (
    <div className="border-b bg-muted/40">
      <div className="container mx-auto px-4 py-3 md:px-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>
    </div>
  );
}
