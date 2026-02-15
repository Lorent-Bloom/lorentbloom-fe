"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@shared/ui/dialog";
import { useTranslations } from "next-intl";
import { LayoutDashboard, UserCog, PackagePlus, ShoppingCart } from "lucide-react";
import { useOnboardingStore } from "../lib/useOnboardingStore";
import { TOUR_IDS } from "../model/tours";
import type { TourId } from "../model/tours";
import type { GuideSelectionModalProps } from "../model/interface";

const guideOptions: { id: TourId; icon: typeof LayoutDashboard; i18nKey: string }[] = [
  { id: TOUR_IDS.ACCOUNT_OVERVIEW, icon: LayoutDashboard, i18nKey: "guides.accountOverview" },
  { id: TOUR_IDS.PROFILE_SETUP, icon: UserCog, i18nKey: "guides.profileSetup" },
  { id: TOUR_IDS.HOW_TO_RENT_OUT, icon: PackagePlus, i18nKey: "guides.howToRentOut" },
  { id: TOUR_IDS.HOW_TO_RENT, icon: ShoppingCart, i18nKey: "guides.howToRent" },
];

export function GuideSelectionModal({ open, onClose }: GuideSelectionModalProps) {
  const t = useTranslations("onboarding");
  const { startTour } = useOnboardingStore();

  const handleSelect = (tourId: TourId) => {
    startTour(tourId);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("guideSelection.title")}</DialogTitle>
          <DialogDescription>{t("guideSelection.description")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {guideOptions.map((guide) => {
            const Icon = guide.icon;
            return (
              <button
                key={guide.id}
                onClick={() => handleSelect(guide.id)}
                className="flex items-start gap-4 rounded-lg border bg-card p-4 text-left transition-colors hover:bg-muted dark:hover:bg-muted/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <p className="text-sm font-semibold">{t(`${guide.i18nKey}.title` as any)}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {t(`${guide.i18nKey}.description` as any)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
