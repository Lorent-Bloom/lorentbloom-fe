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

export function useAuthCheck(locale: string) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    const isPublicPath = publicPaths.some(
      (path) =>
        pathWithoutLocale === path || pathWithoutLocale.startsWith(`${path}/`),
    );

    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${window.location.origin}/api/auth/validate`,
        );
        const data = await response.json();

        // No token at all — nothing to validate
        if (!data.hasToken) return;

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
            router.refresh();
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuth();
  }, [locale, pathname, router]);
}
