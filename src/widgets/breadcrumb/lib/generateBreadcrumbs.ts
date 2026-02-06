import type { BreadcrumbItem } from "../model/interface";

interface GenerateBreadcrumbsProps {
  pathname: string;
  locale: string;
  translations: {
    home: string;
    products: string;
    about: string;
    faq: string;
    howToRentOut: string;
    termsOfPolicy: string;
    accountSettings: string;
    profile: string;
    account: string;
    addresses: string;
    security: string;
    signIn: string;
    signUp: string;
  };
  categoryNames?: Record<string, string>;
}

/**
 * Generates breadcrumb items dynamically based on the current pathname
 * @param pathname - Current URL pathname
 * @param locale - Current locale
 * @param translations - Translation function or object
 * @returns Array of breadcrumb items
 */
export function generateBreadcrumbs({
  pathname,
  locale,
  translations: t,
  categoryNames = {},
}: GenerateBreadcrumbsProps): BreadcrumbItem[] {
  // Remove locale from pathname and split into segments
  // Use regex to only remove locale at the start of the path
  const pathWithoutLocale =
    pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";

  // If we're on home page, return empty array (no breadcrumb needed)
  if (pathWithoutLocale === "/") {
    return [];
  }

  // Filter out empty strings and locale codes (en, ru, ro)
  const locales = ["en", "ru", "ro"];
  const segments = pathWithoutLocale
    .split("/")
    .filter((segment) => Boolean(segment) && !locales.includes(segment));
  const breadcrumbs: BreadcrumbItem[] = [];

  // Always start with home
  breadcrumbs.push({
    label: t.home,
    href: `/${locale}`,
  });

  // Build breadcrumbs for each segment
  let currentPath = `/${locale}`;

  segments.forEach((segment, index) => {
    // Skip URL structure segments that don't have their own pages
    if (
      segment === "products" ||
      segment === "p" ||
      segment === "view" ||
      segment === "order"
    ) {
      currentPath += `/${segment}`;
      return;
    }

    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    // Get label based on segment
    let label = segment;

    // Map known paths to translations
    const pathMap: Record<string, string> = {
      about: t.about,
      faq: t.faq,
      "how-to-rent-out": t.howToRentOut,
      "terms-of-policy": t.termsOfPolicy,
      "account-settings": t.accountSettings,
      profile: t.profile,
      account: t.account,
      addresses: t.addresses,
      security: t.security,
      "sign-in": t.signIn,
      "sign-up": t.signUp,
    };

    // Use translation if available, otherwise format segment
    if (pathMap[segment]) {
      label = pathMap[segment];
    } else if (categoryNames[segment]) {
      // Use category name translation
      label = categoryNames[segment];
    } else {
      // Format dynamic segments (like product URLs or category names)
      let cleanSegment = segment;

      // Remove hash suffix from product slugs (e.g., "t-shirt-693ebaa6227ad" -> "t-shirt")
      // Hash is a 12-character alphanumeric string at the end
      const hashMatch = cleanSegment.match(/-[a-f0-9]{12,}$/i);
      if (hashMatch) {
        cleanSegment = cleanSegment.replace(hashMatch[0], "");
      }

      // Replace hyphens with spaces and capitalize
      label = cleanSegment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
    });
  });

  return breadcrumbs;
}
