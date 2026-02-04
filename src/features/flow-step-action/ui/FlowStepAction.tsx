"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Check, ImagePlus, Loader2, X, AlertCircle } from "lucide-react";
import { Button } from "@shared/ui/button";
import { getUploadThingUrl } from "@shared/api/uploadthing/client";
import { FlowStepProgress, STEP_I18N_KEYS } from "@entities/flow-step";
import { useFlowStepAction } from "../lib/useFlowStepAction";
import type { FlowStepActionProps } from "../model/interface";

export function FlowStepAction({
  conversation,
  currentStep,
  completedSteps,
  currentUserId,
  onStepComplete,
}: FlowStepActionProps) {
  const t = useTranslations("flow-step-action");
  const tSteps = useTranslations("flow-step");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    canTrigger,
    requiresImages,
    isCompleting,
    imageKeys,
    isUploading,
    handleImageUpload,
    removeImage,
    handleComplete,
    userRole,
  } = useFlowStepAction({
    conversation,
    currentStep,
    currentUserId,
    onStepComplete,
  });

  // All steps completed
  if (!currentStep) {
    return (
      <div className="p-4 border-b bg-green-50 dark:bg-green-950/20">
        <div className="flex items-center gap-2 text-green-600">
          <Check className="h-5 w-5" />
          <span className="font-medium">{t("allStepsCompleted")}</span>
        </div>
      </div>
    );
  }

  const stepI18nKey = STEP_I18N_KEYS[currentStep.step_key] || currentStep.step_key;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(Array.from(files));
      e.target.value = "";
    }
  };

  return (
    <div className="border-b bg-muted/30">
      {/* Current step info */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="font-medium text-sm">
              {/* @ts-expect-error - dynamic key pattern */}
              {tSteps(`steps.${stepI18nKey}.name`, { defaultValue: currentStep.name })}
            </h4>
            {currentStep.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {/* @ts-expect-error - dynamic key pattern */}
                {tSteps(`steps.${stepI18nKey}.description`, { defaultValue: currentStep.description })}
              </p>
            )}
          </div>
        </div>

        {/* Progress indicator */}
        <FlowStepProgress
          currentStepId={currentStep.id}
          completedSteps={completedSteps}
          steps={[currentStep]} // Will be replaced with all steps in widget
        />

        {/* Action section */}
        {canTrigger ? (
          <div className="space-y-3 pt-2">
            {/* Image upload section */}
            {requiresImages && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>{t("imagesRequiredHint")}</span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isCompleting || imageKeys.length >= 5}
                />

                {/* Image previews */}
                {imageKeys.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {imageKeys.map((key, index) => (
                      <div key={key} className="relative group">
                        <Image
                          src={getUploadThingUrl(key)}
                          alt={`Upload ${index + 1}`}
                          width={80}
                          height={80}
                          className="h-20 w-20 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 h-5 w-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {isUploading && (
                      <div className="h-20 w-20 border rounded-lg flex items-center justify-center bg-background">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isCompleting || imageKeys.length >= 5}
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  {t("addImages")}
                </Button>
              </div>
            )}

            {/* Complete button */}
            <Button
              onClick={handleComplete}
              disabled={isCompleting || (requiresImages && imageKeys.length === 0)}
              className="w-full"
            >
              {isCompleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("completing")}
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {t("confirmStep")}
                </>
              )}
            </Button>
          </div>
        ) : currentStep.triggered_by !== "system" ? (
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              {t("waitingFor", {
                party: userRole === "owner" ? t("customer") : t("owner"),
              })}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
