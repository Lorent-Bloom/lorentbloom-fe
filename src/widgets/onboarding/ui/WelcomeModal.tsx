"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";
import { useOnboardingWelcome } from "../lib/useOnboardingWelcome";
import type { WelcomeModalProps } from "../model/interface";

export function WelcomeModal({ open, onClose }: WelcomeModalProps) {
  const { t } = useOnboardingWelcome();

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("welcome.title")}</DialogTitle>
          <DialogDescription>{t("welcome.description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              1
            </span>
            <p className="text-sm">{t("welcome.step1")}</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              2
            </span>
            <p className="text-sm">{t("welcome.step2")}</p>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={onClose}
            className="hover:bg-primary/90 dark:hover:bg-primary/80"
          >
            {t("welcome.getStarted")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
