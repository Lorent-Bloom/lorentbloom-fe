import type { Metadata } from "next";
import { LOCALES, DEFAULT_LOCALE } from "@shared/config/i18n";
import { BRAND } from "@shared/config/brand";

export const SITE_NAME = BRAND.name;
export const PRODUCTION_DOMAIN = BRAND.domain;

export function getCanonicalUrl(locale: string, path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : path ? `/${path}` : "";
  return `${PRODUCTION_DOMAIN}/${locale}${cleanPath}`;
}

export function getAlternateLanguages(
  path: string = "",
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    languages[locale] = getCanonicalUrl(locale, path);
  }
  languages["x-default"] = getCanonicalUrl(DEFAULT_LOCALE, path);
  return languages;
}

export function getCommonMetadata(
  locale: string,
  path: string = "",
  options?: { noIndex?: boolean },
): Partial<Metadata> {
  const canonical = getCanonicalUrl(locale, path);
  const alternateLanguages = getAlternateLanguages(path);

  return {
    alternates: {
      canonical,
      languages: alternateLanguages,
    },
    openGraph: {
      siteName: SITE_NAME,
      locale,
      url: canonical,
      type: "website",
      images: [
        {
          url: `${PRODUCTION_DOMAIN}/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - Rental Marketplace in Moldova`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: options?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
