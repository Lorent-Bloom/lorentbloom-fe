"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const publicPaths = [
  "/",
  "/sign-in",
  "/sign-up",
  "/faq",
  "/about",
  "/how-to-rent-out",
  "/terms-of-policy",
  "/cookie-policy",
  "/products",
  "/product-search",
  "/contact-us",
  "/customer/account/confirm",
];

export function useAuthCheck(locale: string, hasToken: boolean) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    const isPublicPath = publicPaths.some(
      (path) =>
        pathWithoutLocale === path || pathWithoutLocale.startsWith(`${path}/`),
    );

    // No token - nothing to validate
    if (!hasToken) {
      return;
    }

    // Check if token is valid (even on public routes to clear expired tokens)
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${window.location.origin}/api/auth/validate`,
        );

        if (!response.ok) {
          // Token is invalid/expired - clear it
          await fetch(`${window.location.origin}/api/auth/clear-expired`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ locale }),
          });

          // Redirect to sign-in only if on a protected route
          // Public routes (including home) can stay where they are
          if (!isPublicPath) {
            router.push(`/${locale}/sign-in`);
          } else {
            // Force a page refresh to clear the hasToken state on public routes
            router.refresh();
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuth();
  }, [locale, hasToken, pathname, router]);
}
