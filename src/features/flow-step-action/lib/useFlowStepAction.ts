"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { completeFlowStep } from "@entities/flow-step";
import { useChatImageUpload } from "@features/chat-input";
import type { FlowStepActionProps, UseFlowStepActionReturn } from "../model/interface";

export const useFlowStepAction = ({
  conversation,
  currentStep,
  currentUserId,
  onStepComplete,
}: Omit<FlowStepActionProps, "completedSteps">): UseFlowStepActionReturn => {
  const t = useTranslations("flow-step-action");
  const [isCompleting, setIsCompleting] = useState(false);

  const {
    imageKeys,
    isUploading,
    handleUpload,
    removeImage,
    clearImages,
  } = useChatImageUpload();

  const userRole = useMemo(() => {
    // currentUserId is the email, so compare by email field
    return conversation.owner?.email === currentUserId ? "owner" : "receiver";
  }, [conversation.owner?.email, currentUserId]);

  const canTrigger = useMemo(() => {
    if (!currentStep) return false;
    // System steps are auto-triggered, users can't manually trigger them
    if (currentStep.triggered_by === "system") return false;
    // Steps with no required action don't need user interaction
    if (currentStep.required_action === "none") return false;
    // User can only trigger steps assigned to their role
    return currentStep.triggered_by === userRole;
  }, [currentStep, userRole]);

  const requiresImages = useMemo(() => {
    if (!currentStep) return false;
    return currentStep.required_action === "upload_images" || currentStep.required_action === "both";
  }, [currentStep]);

  const requiresConfirm = useMemo(() => {
    if (!currentStep) return false;
    return currentStep.required_action === "confirm" || currentStep.required_action === "both";
  }, [currentStep]);

  const handleComplete = useCallback(async () => {
    if (!currentStep || !canTrigger) return;

    // Validate images if required
    if (requiresImages && imageKeys.length === 0) {
      toast.error(t("imagesRequired"));
      return;
    }

    setIsCompleting(true);

    const result = await completeFlowStep({
      conversationId: conversation.id,
      stepId: currentStep.id,
      imageKeys: imageKeys.length > 0 ? imageKeys : undefined,
    });

    if (result.success) {
      toast.success(t("stepCompleted"));
      clearImages();
      onStepComplete();
    } else {
      toast.error(result.error || t("stepFailed"));
    }

    setIsCompleting(false);
  }, [currentStep, canTrigger, requiresImages, imageKeys, conversation.id, clearImages, onStepComplete, t]);

  const handleImageUpload = useCallback(
    async (files: File[]) => {
      await handleUpload(files);
    },
    [handleUpload]
  );

  return {
    canTrigger,
    requiresImages,
    requiresConfirm,
    isCompleting,
    imageKeys,
    isUploading,
    handleImageUpload,
    removeImage,
    handleComplete,
    userRole,
  };
};
