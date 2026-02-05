"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { z } from "zod";
import {
  updateCustomerName,
  updateCustomerEmail,
  changeCustomerPassword,
  updateCustomerAttributes,
  buildCustomAttributesInput,
} from "@entities/customer";
import {
  NameSectionSchema,
  EmailSectionSchema,
  PasswordSectionSchema,
  type TUnifiedAccountSettingsSchema,
} from "../model/schema";
import type {
  UseUnifiedAccountSettingsFormProps,
  EnabledSections,
} from "../model/interface";
import { useRecaptcha, verifyRecaptcha } from "@shared/lib/recaptcha";

export const useUnifiedAccountSettings = ({
  defaultValues,
  locale,
  highlightField,
}: UseUnifiedAccountSettingsFormProps) => {
  const router = useRouter();
  const t = useTranslations("unified-account-settings");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { executeRecaptcha } = useRecaptcha();
  const [activeHighlight, setActiveHighlight] = useState<string | undefined>(
    highlightField,
  );
  const [enabledSections, setEnabledSections] = useState<EnabledSections>({
    name: false,
    email: false,
    password: false,
  });

  // Dynamic schema based on enabled sections (name is always included)
  const dynamicSchema = useMemo(() => {
    const schemaShape: Record<string, z.ZodTypeAny> = {};

    // Always include name section
    Object.assign(schemaShape, NameSectionSchema.shape);

    if (enabledSections.email) {
      Object.assign(schemaShape, EmailSectionSchema.shape);
    }
    if (enabledSections.password) {
      Object.assign(schemaShape, PasswordSectionSchema.shape);
    }

    const baseSchema = z.object(schemaShape);

    // Add password confirmation refinement if password section enabled
    if (enabledSections.password) {
      return baseSchema.refine(
        (data) => {
          const typedData = data as TUnifiedAccountSettingsSchema;
          return typedData.newPassword === typedData.confirmPassword;
        },
        {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        },
      );
    }

    return baseSchema;
  }, [enabledSections]);

  const form = useForm<TUnifiedAccountSettingsSchema>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {
      firstname: defaultValues.firstname,
      lastname: defaultValues.lastname,
      telephone: defaultValues.telephone,
      personal_number: defaultValues.personal_number,
      email: defaultValues.email,
      currentPasswordForEmail: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Clear highlight if field already has a value on mount, or when value changes
  useEffect(() => {
    if (!activeHighlight) return;

    // Check if the highlighted field already has a value
    const currentValue = form.getValues(
      activeHighlight as keyof TUnifiedAccountSettingsSchema,
    );
    if (currentValue) {
      setActiveHighlight(undefined);
      return;
    }

    // Watch for changes to clear highlight when user starts typing
    const subscription = form.watch((value, { name }) => {
      if (name === activeHighlight && value[name]) {
        setActiveHighlight(undefined);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, activeHighlight]);

  const toggleSection = (section: keyof EnabledSections) => {
    setEnabledSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const onSubmit = async (values: TUnifiedAccountSettingsSchema) => {
    setIsSubmitting(true);
    const results: { success: boolean; error?: string }[] = [];
    let hasSessionExpired = false;

    try {
      const recaptchaToken = await executeRecaptcha("unified_account_settings");
      const recaptchaResult = await verifyRecaptcha(
        recaptchaToken,
        "unified_account_settings",
      );
      if (!recaptchaResult.success) {
        toast.error("Verification failed. Please try again.");
        return;
      }

      // Always update name section fields (always visible)
      if (values.firstname && values.lastname) {
        const nameResult = await updateCustomerName({
          firstname: values.firstname,
          lastname: values.lastname,
        });
        results.push(nameResult);

        if (!nameResult.success && nameResult.error === "SESSION_EXPIRED") {
          hasSessionExpired = true;
        }
      }

      // Update custom attributes (telephone and personal_number)
      const customAttributesData: Record<string, string> = {};
      if (values.telephone !== undefined) {
        customAttributesData.telephone = values.telephone || "";
      }
      if (values.personal_number !== undefined) {
        customAttributesData.personal_number = values.personal_number || "";
      }

      if (Object.keys(customAttributesData).length > 0) {
        const attributesResult = await updateCustomerAttributes({
          custom_attributes: buildCustomAttributesInput(customAttributesData),
        });
        results.push(attributesResult);

        if (
          !attributesResult.success &&
          attributesResult.error === "SESSION_EXPIRED"
        ) {
          hasSessionExpired = true;
        }
      }

      // Update email if enabled
      if (enabledSections.email && values.email) {
        // Use shared currentPassword if both sections enabled, otherwise use currentPasswordForEmail
        const passwordForEmail =
          enabledSections.email && enabledSections.password
            ? values.currentPassword
            : values.currentPasswordForEmail;

        if (passwordForEmail) {
          const emailResult = await updateCustomerEmail({
            email: values.email,
            password: passwordForEmail,
          });
          results.push(emailResult);

          if (!emailResult.success && emailResult.error === "SESSION_EXPIRED") {
            hasSessionExpired = true;
          }
        }
      }

      // Change password if enabled
      if (
        enabledSections.password &&
        values.currentPassword &&
        values.newPassword
      ) {
        const passwordResult = await changeCustomerPassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        results.push(passwordResult);

        if (
          !passwordResult.success &&
          passwordResult.error === "SESSION_EXPIRED"
        ) {
          hasSessionExpired = true;
        }
      }

      // Handle session expiration
      if (hasSessionExpired) {
        toast.error(t("errors.sessionExpired"));
        router.push(`/${locale}/sign-in`);
        return;
      }

      // Check if all operations succeeded
      const allSucceeded = results.every((r) => r.success);
      const anySucceeded = results.some((r) => r.success);

      if (allSucceeded) {
        toast.success(t("success.allUpdated"));
        // Reset enabled sections
        setEnabledSections({
          name: false,
          email: false,
          password: false,
        });
        // Clear password fields
        form.setValue("currentPasswordForEmail", "");
        form.setValue("currentPassword", "");
        form.setValue("newPassword", "");
        form.setValue("confirmPassword", "");
        // Refresh to show updated data
        router.refresh();
      } else if (anySucceeded) {
        toast.warning(t("success.partiallyUpdated"));
        router.refresh();
      } else {
        const failedResult = results.find((r) => !r.success);
        toast.error(failedResult?.error || t("errors.updateFailed"));
      }
    } catch {
      toast.error(t("errors.unknownError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting,
    enabledSections,
    toggleSection,
    highlightField: activeHighlight,
    t,
  };
};
