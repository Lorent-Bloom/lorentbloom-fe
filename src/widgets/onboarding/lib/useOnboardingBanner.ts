"use client";

import { useSyncExternalStore, useCallback, useState } from "react";
import { useOnboardingStore } from "./useOnboardingStore";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

interface UseOnboardingBannerInput {
  hasIdnp: boolean;
  hasProducts: boolean;
}

export const useOnboardingBanner = ({
  hasIdnp,
  hasProducts,
}: UseOnboardingBannerInput) => {
  const { dismissed, welcomeShown, restarted, dismiss, markWelcomeShown } =
    useOnboardingStore();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [showGuideSelection, setShowGuideSelection] = useState(false);

  const allComplete = hasIdnp && hasProducts;

  const showWelcome =
    mounted && !dismissed && !welcomeShown && !allComplete;

  const showBanner =
    mounted && !dismissed && (!allComplete || restarted);

  const handleWelcomeClose = useCallback(() => {
    markWelcomeShown();
    setShowGuideSelection(true);
  }, [markWelcomeShown]);

  const handleGuideSelectionClose = useCallback(() => {
    setShowGuideSelection(false);
  }, []);

  const handleDismiss = useCallback(() => {
    dismiss();
  }, [dismiss]);

  return {
    showWelcome,
    showBanner,
    showGuideSelection,
    restarted,
    allComplete,
    handleWelcomeClose,
    handleGuideSelectionClose,
    handleDismiss,
  };
};
