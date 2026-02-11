"use client";

import { useCallback } from "react";
import type { ConsentState } from "../model/interface";

declare global {
  interface Window {
    dataLayer?: object[];
    gtag: (...args: unknown[]) => void;
  }
}

export const useGoogleConsentMode = () => {
  const updateConsent = useCallback((consentState: ConsentState) => {
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", consentState);
    }
  }, []);

  return { updateConsent };
};
