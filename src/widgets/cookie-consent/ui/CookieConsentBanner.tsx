"use client";

import { Button } from "@shared/ui";
import { useCookieConsent } from "../lib/useCookieConsent";
import { CookiePreferencesSheet } from "./CookiePreferencesSheet";

export function CookieConsentBanner() {
  const {
    t,
    isVisible,
    isSheetOpen,
    preferences,
    categories,
    handleAcceptAll,
    handleRejectAll,
    handleToggleCategory,
    handleSavePreferences,
    handleOpenSheet,
    handleCloseSheet,
  } = useCookieConsent();

  if (!isVisible) return null;

  return (
    <>
      {!isSheetOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm p-4 shadow-lg md:p-6">
          <div className="container mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground max-w-2xl">
              {t("message")}
            </p>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenSheet}
                className="hover:bg-muted dark:hover:bg-muted/50"
              >
                {t("manage")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRejectAll}
                className="hover:bg-muted dark:hover:bg-muted/50"
              >
                {t("rejectAll")}
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="hover:bg-primary/90 dark:hover:bg-primary/80"
              >
                {t("acceptAll")}
              </Button>
            </div>
          </div>
        </div>
      )}

      <CookiePreferencesSheet
        open={isSheetOpen}
        onOpenChange={handleCloseSheet}
        preferences={preferences}
        onToggle={handleToggleCategory}
        onSave={handleSavePreferences}
        categories={categories}
      />
    </>
  );
}
