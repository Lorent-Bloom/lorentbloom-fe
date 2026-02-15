"use client";

import { useSyncExternalStore, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@shared/ui/button";
import { CheckCircle2, BookOpen } from "lucide-react";
import { useOnboardingStore } from "../lib/useOnboardingStore";
import { GuideSelectionModal } from "./GuideSelectionModal";
import type { OnboardingStatusProps } from "../model/interface";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function OnboardingStatus({
  hasIdnp,
  hasProducts,
}: OnboardingStatusProps) {
  const { dismissed, restarted } = useOnboardingStore();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const t = useTranslations("onboarding");
  const [guideOpen, setGuideOpen] = useState(false);

  const handleOpenGuides = useCallback(() => {
    setGuideOpen(true);
  }, []);

  const handleCloseGuides = useCallback(() => {
    setGuideOpen(false);
  }, []);

  if (!mounted) return null;

  const allComplete = hasIdnp && hasProducts;

  // Hide when banner is active (restarted or steps incomplete)
  if (restarted) return null;
  // Show only when onboarding is dismissed or fully completed
  if (!dismissed && !allComplete) return null;

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border bg-card p-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="text-sm text-muted-foreground">
            {allComplete
              ? t("status.completed")
              : t("status.dismissed")}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleOpenGuides}
          className="gap-1.5 hover:bg-muted dark:hover:bg-muted/50"
        >
          <BookOpen className="h-3.5 w-3.5" />
          {t("status.restart")}
        </Button>
      </div>
      <GuideSelectionModal open={guideOpen} onClose={handleCloseGuides} />
    </>
  );
}
