import { useTransition } from "react";
import { useParams, usePathname as useNextPathname } from "next/navigation";
import {
  useRouter,
  type Locale,
  LOCALE_COOKIE_NAME,
  LOCALES,
  DEFAULT_LOCALE,
} from "@shared/config/i18n";

export const useLanguageSelectorClient = () => {
  const params = useParams();
  // Get locale from URL params, fallback to default
  const localeParam = params?.locale as string;
  const currentLocale = (
    LOCALES.includes(localeParam) ? localeParam : DEFAULT_LOCALE
  ) as Locale;

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  // Use Next.js pathname to get full path including locale
  const fullPathname = useNextPathname();

  const setLocale = (newLocale: Locale) => {
    // Save current scroll position
    const scrollY = window.scrollY;

    // Set cookie
    document.cookie = `${LOCALE_COOKIE_NAME}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    // Extract path without locale from full pathname
    // e.g., /en/about -> /about, /ro/products/123 -> /products/123
    const pathWithoutLocale =
      fullPathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";

    // Use startTransition to prevent layout jumping
    startTransition(() => {
      router.replace(pathWithoutLocale, { locale: newLocale });
    });

    // Restore scroll position after a short delay
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollY, behavior: "instant" });
    });
  };

  return { currentLocale, setLocale, isPending };
};
