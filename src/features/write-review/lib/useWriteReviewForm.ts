"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  createProductReview,
  getProductReviewRatingsMetadata,
  type ProductReviewRatingMetadata,
  type ProductReviewRatingInput,
} from "@entities/product-review";
import {
  WriteReviewFormSchema,
  type TWriteReviewFormSchema,
} from "../model/schema";
import { WRITE_REVIEW_FORM_DEFAULT_VALUES } from "../model/const";
import { useRecaptcha, verifyRecaptcha } from "@shared/lib/recaptcha";

export function useWriteReviewForm(
  productSku: string,
  onReviewSubmitted?: () => void,
) {
  const t = useTranslations("write-review");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { executeRecaptcha } = useRecaptcha();
  const [ratingsMetadata, setRatingsMetadata] = useState<
    ProductReviewRatingMetadata[]
  >([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);

  const form = useForm<TWriteReviewFormSchema>({
    resolver: zodResolver(WriteReviewFormSchema),
    defaultValues: WRITE_REVIEW_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    async function loadRatingsMetadata() {
      const result = await getProductReviewRatingsMetadata();
      if (result.success && result.data) {
        setRatingsMetadata(result.data);
      } else {
        toast.error(result.error || t("loadRatingsFailed"));
      }
      setIsLoadingMetadata(false);
    }

    loadRatingsMetadata();
  }, [t]);

  const onFormSubmit = async (values: TWriteReviewFormSchema) => {
    setIsSubmitting(true);

    try {
      const recaptchaToken = await executeRecaptcha("write_review");
      const recaptchaResult = await verifyRecaptcha(recaptchaToken, "write_review");
      if (!recaptchaResult.success) {
        toast.error("Verification failed. Please try again.");
        return;
      }

      // Transform ratings object to array format expected by API
      const ratings: ProductReviewRatingInput[] = Object.entries(
        values.ratings,
      ).map(([id, value_id]) => ({
        id,
        value_id,
      }));

      const result = await createProductReview({
        sku: productSku,
        nickname: values.nickname,
        summary: values.summary,
        text: values.text,
        ratings,
      });

      if (result.success) {
        toast.success(t("submitSuccess"));
        form.reset();
        onReviewSubmitted?.();
      } else {
        toast.error(result.error || t("submitFailed"));
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(t("unexpectedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onFormSubmit,
    isSubmitting,
    ratingsMetadata,
    isLoadingMetadata,
  };
}
