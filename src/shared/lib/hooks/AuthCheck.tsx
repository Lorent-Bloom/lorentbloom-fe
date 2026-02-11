"use client";

import { useAuthCheck } from "./useAuthCheck";

interface AuthCheckProps {
  locale: string;
}

export function AuthCheck({ locale }: AuthCheckProps) {
  useAuthCheck(locale);
  return null;
}
