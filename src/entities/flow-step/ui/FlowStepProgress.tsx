import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { cn } from "@shared/lib/utils";
import { STEP_I18N_KEYS } from "../model/const";
import type { FlowStepProgressProps } from "../model/interface";

export function FlowStepProgress({
  currentStepId,
  completedSteps,
  steps,
}: FlowStepProgressProps) {
  const t = useTranslations("flow-step");

  const completedStepIds = new Set(completedSteps.map((s) => s.step_id));
  const sortedSteps = [...steps].sort((a, b) => a.step_order - b.step_order);

  const currentStep = currentStepId
    ? sortedSteps.find((s) => s.id === currentStepId)
    : null;
  const currentStepIndex = currentStep
    ? sortedSteps.findIndex((s) => s.id === currentStepId)
    : sortedSteps.length;

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="flex items-center gap-1 mb-2">
        {sortedSteps.map((step, index) => {
          const isCompleted = completedStepIds.has(step.id);
          const isCurrent = step.id === currentStepId;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className={cn(
                  "h-2 flex-1 rounded-full transition-colors",
                  isCompleted
                    ? "bg-green-500"
                    : isCurrent
                      ? "bg-primary"
                      : "bg-muted",
                )}
              />
              {index < sortedSteps.length - 1 && <div className="w-1" />}
            </div>
          );
        })}
      </div>

      {/* Step indicators */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {currentStepIndex + 1} / {sortedSteps.length}
        </span>
        {currentStep && (
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            {t(
              // @ts-expect-error - dynamic key pattern
              `steps.${STEP_I18N_KEYS[currentStep.step_key] || currentStep.step_key}.name`,
              {
                defaultValue: currentStep.name,
              },
            )}
          </span>
        )}
        {!currentStepId && (
          <span className="flex items-center gap-1 text-green-600">
            <Check className="h-3 w-3" />
            {t("allComplete")}
          </span>
        )}
      </div>
    </div>
  );
}
