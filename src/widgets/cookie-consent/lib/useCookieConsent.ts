"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import type { ConsentState, ConsentCategory } from "../model/interface";
import {
  COOKIE_CONSENT_KEY,
  DEFAULT_CONSENT_STATE,
  ALL_GRANTED_STATE,
  ALL_CATEGORIES,
} from "../model/const";
import { useGoogleConsentMode } from "./useGoogleConsentMode";

function getStoredConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as ConsentState;
  } catch {
    return null;
  }
}

export const useCookieConsent = () => {
  const t = useTranslations("cookie-consent");
  const { updateConsent } = useGoogleConsentMode();
  const consentApplied = useRef(false);

  const [isVisible, setIsVisible] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [preferences, setPreferences] = useState<ConsentState>(
    DEFAULT_CONSENT_STATE,
  );

  // Check localStorage on mount: show banner only if no consent stored
  useEffect(() => {
    if (consentApplied.current) return;
    consentApplied.current = true;

    const stored = getStoredConsent();
    if (stored) {
      setPreferences(stored);
      updateConsent(stored);
    } else {
      setIsVisible(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveConsent = useCallback(
    (state: ConsentState) => {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(state));
      setPreferences(state);
      updateConsent(state);
      setIsVisible(false);
      setIsSheetOpen(false);
    },
    [updateConsent],
  );

  const handleAcceptAll = useCallback(() => {
    saveConsent(ALL_GRANTED_STATE);
  }, [saveConsent]);

  const handleRejectAll = useCallback(() => {
    saveConsent(DEFAULT_CONSENT_STATE);
  }, [saveConsent]);

  const handleToggleCategory = useCallback((category: ConsentCategory) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: prev[category] === "granted" ? "denied" : "granted",
    }));
  }, []);

  const handleSavePreferences = useCallback(() => {
    saveConsent(preferences);
  }, [preferences, saveConsent]);

  const handleOpenSheet = useCallback(() => {
    setIsSheetOpen(true);
  }, []);

  const handleCloseSheet = useCallback((open: boolean) => {
    setIsSheetOpen(open);
  }, []);

  return {
    t,
    isVisible,
    isSheetOpen,
    preferences,
    categories: ALL_CATEGORIES,
    handleAcceptAll,
    handleRejectAll,
    handleToggleCategory,
    handleSavePreferences,
    handleOpenSheet,
    handleCloseSheet,
  };
};
