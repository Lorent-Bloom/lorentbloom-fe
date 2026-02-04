import { useTranslations } from "next-intl";
import { Badge } from "@shared/ui/badge";
import { STEP_I18N_KEYS } from "../model/const";
import type { FlowStepBadgeProps } from "../model/interface";

export function FlowStepBadge({ currentStepId, steps }: FlowStepBadgeProps) {
  const t = useTranslations("flow-step");

  if (!currentStepId) {
    return (
      <Badge variant="outline" className="text-green-600 border-green-600">
        {t("completed")}
      </Badge>
    );
  }

  const currentStep = steps.find((s) => s.id === currentStepId);

  // If step not found in the steps array, show a fallback
  if (!currentStep) {
    return (
      <Badge variant="secondary">
        Step {currentStepId}
      </Badge>
    );
  }

  const i18nKey = STEP_I18N_KEYS[currentStep.step_key] || currentStep.step_key;

  return (
    <Badge variant="secondary">
      {/* @ts-expect-error - dynamic key pattern */}
      {t(`steps.${i18nKey}.name`, { defaultValue: currentStep.name })}
    </Badge>
  );
}
