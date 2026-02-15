"use client";

import { useOnboardingBanner } from "../lib/useOnboardingBanner";
import { WelcomeModal } from "./WelcomeModal";
import { OnboardingBanner } from "./OnboardingBanner";
import { GuideSelectionModal } from "./GuideSelectionModal";
import type { OnboardingProviderProps } from "../model/interface";

export function OnboardingProvider({
  hasIdnp,
  hasProducts,
  locale,
}: OnboardingProviderProps) {
  const {
    showWelcome,
    showBanner,
    showGuideSelection,
    restarted,
    handleWelcomeClose,
    handleGuideSelectionClose,
    handleDismiss,
  } = useOnboardingBanner({ hasIdnp, hasProducts });

  return (
    <>
      {showWelcome && (
        <WelcomeModal open={showWelcome} onClose={handleWelcomeClose} />
      )}
      {showGuideSelection && (
        <GuideSelectionModal
          open={showGuideSelection}
          onClose={handleGuideSelectionClose}
        />
      )}
      {showBanner && (
        <OnboardingBanner
          hasIdnp={hasIdnp}
          hasProducts={hasProducts}
          restarted={restarted}
          locale={locale}
          onDismiss={handleDismiss}
        />
      )}
    </>
  );
}
