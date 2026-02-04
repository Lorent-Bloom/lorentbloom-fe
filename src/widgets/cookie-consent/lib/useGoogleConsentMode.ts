"use client";

import { useCallback, useEffect, useRef } from "react";
import type { ConsentState } from "../model/interface";
import { DEFAULT_CONSENT_STATE } from "../model/const";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export const useGoogleConsentMode = () => {
  const defaultSet = useRef(false);

  useEffect(() => {
    if (defaultSet.current) return;
    defaultSet.current = true;

    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments);
      };
    }

    window.gtag("consent", "default", DEFAULT_CONSENT_STATE);
  }, []);

  const updateConsent = useCallback((consentState: ConsentState) => {
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", consentState);
    }
  }, []);

  return { updateConsent };
};
