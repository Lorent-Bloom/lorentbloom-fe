"use client";

import { Button } from "@shared/ui/button";
import { X, PartyPopper } from "lucide-react";
import { useTranslations } from "next-intl";
import { OnboardingStep } from "./OnboardingStep";
import type { OnboardingBannerProps } from "../model/interface";

export function OnboardingBanner({
  hasIdnp,
  hasProducts,
  restarted,
  locale,
  onDismiss,
}: OnboardingBannerProps) {
  const t = useTranslations("onboarding");
  const allComplete = hasIdnp && hasProducts;

  if (allComplete && !restarted) {
    return (
      <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PartyPopper className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              {t("banner.congratulations")}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const completedCount = [hasIdnp, hasProducts].filter(Boolean).length;

  return (
    <div className="mb-6 rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold">{t("banner.title")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("banner.subtitle", { completed: completedCount, total: 2 })}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="h-8 w-8 p-0 hover:bg-muted dark:hover:bg-muted/50"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <OnboardingStep
          stepNumber={1}
          title={t("steps.idnp.title")}
          description={t("steps.idnp.description")}
          completed={hasIdnp}
          actionLabel={t("steps.idnp.action")}
          actionHref={`/${locale}/account/settings?highlight=personal_number`}
        />
        <OnboardingStep
          stepNumber={2}
          title={t("steps.product.title")}
          description={t("steps.product.description")}
          completed={hasProducts}
          actionLabel={t("steps.product.action")}
          actionHref={`/${locale}/account/my-products`}
        />
      </div>
    </div>
  );
}
