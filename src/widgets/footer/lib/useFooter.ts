"use client";

import { useTranslations, useLocale } from "next-intl";
import { useMemo } from "react";

interface FooterLink {
  id: string;
  href: string;
  label: string;
}

interface FooterLinks {
  help: FooterLink[];
  information: FooterLink[];
}

export const useFooter = () => {
  const t = useTranslations("footer");
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  const footerLinks: FooterLinks = useMemo(
    () => ({
      help: [
        { id: "faq", href: `/${locale}/faq`, label: t("links.faq") },
        {
          id: "how-to-rent",
          href: `/${locale}/how-to-rent-out`,
          label: t("links.howToRent"),
        },
        {
          id: "contact",
          href: `/${locale}/contact-us`,
          label: t("links.contact"),
        },
      ],
      information: [
        { id: "about", href: `/${locale}/about`, label: t("links.about") },
        {
          id: "terms",
          href: `/${locale}/terms-of-policy`,
          label: t("links.terms"),
        },
        {
          id: "cookies",
          href: `/${locale}/cookie-policy`,
          label: t("links.cookies"),
        },
      ],
    }),
    [locale, t],
  );

  return {
    t,
    locale,
    currentYear,
    footerLinks,
  };
};
