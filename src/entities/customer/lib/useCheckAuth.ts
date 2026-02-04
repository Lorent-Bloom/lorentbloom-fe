"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useCallback } from "react";

/**
 * Hook to check authentication status and handle redirects
 * Returns a function that checks auth and redirects to sign-in if not authenticated
 */
export function useCheckAuth() {
  const router = useRouter();
  const locale = useLocale();

  /**
   * Checks if user is authenticated (has customer data)
   * If not authenticated, redirects to sign-in with return URL
   * @param returnUrl - URL to redirect back to after successful sign-in
   * @returns true if authenticated, false if not (and redirects)
   */
  const checkAuth = useCallback(
    async (returnUrl?: string) => {
      try {
        const { getCustomerClient } = await import("../api/action/client");
        const customer = await getCustomerClient();

        if (!customer) {
          const redirectPath = returnUrl
            ? `/${locale}/sign-in?redirect=${encodeURIComponent(returnUrl)}`
            : `/${locale}/sign-in`;
          router.push(redirectPath);
          return false;
        }

        return true;
      } catch {
        const redirectPath = returnUrl
          ? `/${locale}/sign-in?redirect=${encodeURIComponent(returnUrl)}`
          : `/${locale}/sign-in`;
        router.push(redirectPath);
        return false;
      }
    },
    [router, locale],
  );

  return { checkAuth };
}
