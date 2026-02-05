"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { submitChatReport } from "../api/action/server";
import { ChatReportSchema, type TChatReportSchema } from "../model/schema";
import { useRecaptcha } from "@shared/lib/recaptcha";

export const useChatReportModal = (
  conversationId: string,
  onClose: () => void,
  onSuccess?: () => void,
) => {
  const t = useTranslations("chat-report");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { executeRecaptcha } = useRecaptcha();

  const form = useForm<TChatReportSchema>({
    resolver: zodResolver(ChatReportSchema),
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = async (values: TChatReportSchema) => {
    setIsSubmitting(true);

    try {
      const recaptchaToken = await executeRecaptcha("chat_report");
      const result = await submitChatReport(
        { conversationId, description: values.description },
        recaptchaToken,
      );

      if (result.success) {
        toast.success(t("submitSuccess"));
        form.reset();
        onSuccess?.();
        onClose();
      } else {
        toast.error(result.error || t("submitFailed"));
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error(t("unexpectedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting,
  };
};
