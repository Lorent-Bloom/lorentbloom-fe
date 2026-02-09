import createMiddleware from "next-intl/middleware";
import { routing } from "@shared/config/i18n";
import { TOKEN_COOKIE_NAME } from "@shared/api";
import type { NextRequest } from "next/server";

// Public paths that don't require authentication
const publicPaths = [
  "/",
  "/sign-in",
  "/sign-up",
  "/faq",
  "/about",
  "/how-to-rent-out",
  "/products",
  "/all-products",
  "/product-search",
  "/terms-of-policy",
  "/cookie-policy",
  "/contact-us",
  "/customer/account/confirm",
];
// Auth-locked paths (authenticated users can't access)
const authLockedPaths = ["/sign-in", "/sign-up"];

const locales = new Set<string>(routing.locales);

const handleI18nRouting = createMiddleware(routing);

const isAuthenticated = (request: NextRequest) => {
  return Boolean(request.cookies.get(TOKEN_COOKIE_NAME)?.value);
};

const isPublicPath = (pathname: string) => {
  // Check exact matches
  if (publicPaths.includes(pathname)) {
    return true;
  }
  // Check if it's a product detail page
  if (pathname.startsWith("/products/")) {
    return true;
  }
  return false;
};

const isAuthLockedPath = (pathname: string) => {
  return authLockedPaths.includes(pathname);
};

export async function proxy(request: NextRequest) {
  // Skip middleware for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return;
  }

  const [, firstSegment, ...segments] = request.nextUrl.pathname.split("/");
  const hasLocalePrefix = locales.has(firstSegment);
  const pathname = hasLocalePrefix
    ? `/${segments.join("/")}` || "/"
    : `/${firstSegment}${segments.length ? `/${segments.join("/")}` : ""}`;

  const locale = hasLocalePrefix ? firstSegment : routing.defaultLocale;
  const auth = isAuthenticated(request);

  // If user is authenticated and trying to access sign-in/sign-up, redirect to home
  if (auth && isAuthLockedPath(pathname)) {
    return Response.redirect(new URL(`/${locale}`, request.url));
  }

  // If user is not authenticated and trying to access private pages, redirect to home
  if (!auth && !isPublicPath(pathname)) {
    return Response.redirect(new URL(`/${locale}`, request.url));
  }

  // Let next-intl handle locale routing - URL is the source of truth
  // The cookie is only used by next-intl for initial visits without a locale prefix
  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap\\.xml|robots\\.txt|manifest\\.webmanifest|icon\\.png|\\.well-known|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
