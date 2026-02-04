"use client";

import { useAuthCheck } from "./useAuthCheck";

interface AuthCheckProps {
  locale: string;
  hasToken: boolean;
}

export function AuthCheck({ locale, hasToken }: AuthCheckProps) {
  useAuthCheck(locale, hasToken);
  return null;
}
