"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@shared/ui/button";
import { Checkbox } from "@shared/ui/checkbox";
import { Label } from "@shared/ui/label";
import { IdnpInput } from "@shared/ui";
import { Alert, AlertDescription } from "@shared/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { Loader2, CheckCircle2, AlertCircle, Globe } from "lucide-react";
import { SignaturePad } from "./SignaturePad";
import { DocumentPreview } from "./DocumentPreview";
import { useDocumentSigning } from "../lib/useDocumentSigning";
import type { SigningFlowProps } from "../model/interface";

const PREVIEW_LANGUAGES = [
  { code: "ro", label: "Română" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
] as const;

/**
 * Moldovan personal number validation (13 digits: 2TTTXXXYYYYYK)
 */
const validatePersonalNumber = (value: string): boolean => {
  if (!value) return false;
  const cleaned = value.replace(/\s/g, "");
  return /^2\d{12}$/.test(cleaned);
};

export function SigningFlow({
  contractData,
  onSign,
  onCancel,
  isSubmitting: externalSubmitting = false,
  isSigned: externalSigned = false,
  signerRole,
  existingPersonalNumber,
}: SigningFlowProps) {
  const t = useTranslations("document-signing");
  const [signature, setSignature] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [personalNumber, setPersonalNumber] = useState(
    existingPersonalNumber || "",
  );
  const [personalNumberError, setPersonalNumberError] = useState<string | null>(
    null,
  );
  const [previewLanguage, setPreviewLanguage] = useState<string>("ro");

  const { isGenerating, error, pdfUrl, generatePreview, clearError } =
    useDocumentSigning();

  // Get validated personal number for preview (only when valid)
  const validatedPersonalNumber = useMemo(() => {
    const cleaned = personalNumber.replace(/\s/g, "");
    return validatePersonalNumber(cleaned) ? cleaned : null;
  }, [personalNumber]);

  // Memoize contract data with validated personal number
  const contractDataWithPersonalNumber = useMemo(() => {
    return {
      ...contractData,
      // Update the appropriate personal number field based on signer role (only when valid)
      ...(signerRole === "renter" && validatedPersonalNumber
        ? { renterPersonalNumber: validatedPersonalNumber }
        : {}),
      ...(signerRole === "owner" && validatedPersonalNumber
        ? { ownerPersonalNumber: validatedPersonalNumber }
        : {}),
    };
  }, [contractData, validatedPersonalNumber, signerRole]);

  // Generate preview when contract data or language changes
  useEffect(() => {
    generatePreview(contractDataWithPersonalNumber, previewLanguage);
  }, [contractDataWithPersonalNumber, previewLanguage, generatePreview]);

  const handlePersonalNumberChange = (value: string) => {
    setPersonalNumber(value);
    setPersonalNumberError(null);
  };

  const handleLanguageChange = (language: string) => {
    setPreviewLanguage(language);
  };

  const handleSubmit = async () => {
    if (!signature || !acceptedTerms) return;

    // Validate personal number
    const cleaned = personalNumber.replace(/\s/g, "");
    if (!validatePersonalNumber(cleaned)) {
      setPersonalNumberError(t("invalidIdnp"));
      return;
    }

    await onSign(signature, "draw", cleaned);
  };

  const isSubmitting = externalSubmitting;
  const hasValidPersonalNumber = validatePersonalNumber(
    personalNumber.replace(/\s/g, ""),
  );
  const canSubmit =
    signature &&
    acceptedTerms &&
    hasValidPersonalNumber &&
    !isSubmitting &&
    !isGenerating;

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearError}
            className="ml-auto"
          >
            {t("dismiss")}
          </Button>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contract Preview */}
        <div className="lg:col-span-1 space-y-3">
          {/* Language Selector for Preview */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t("previewLanguage")}
            </Label>
            <Select
              value={previewLanguage}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PREVIEW_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("previewLanguageHint")}
          </p>
          <DocumentPreview pdfUrl={pdfUrl} isLoading={isGenerating} />
        </div>

        {/* Signature Section */}
        <div className="space-y-6 lg:col-span-1">
          {/* Personal Number Input */}
          <div className="space-y-2">
            <Label htmlFor="personal-number" className="text-sm font-medium">
              {t("idnpLabel")} <span className="text-destructive">*</span>
            </Label>
            <IdnpInput
              id="personal-number"
              value={personalNumber}
              onChange={handlePersonalNumberChange}
              disabled={isSubmitting || !!existingPersonalNumber}
              className={personalNumberError ? "border-destructive" : ""}
            />
            {personalNumberError && (
              <p className="text-sm text-destructive">{personalNumberError}</p>
            )}
            <p className="text-xs text-muted-foreground">{t("idnpHint")}</p>
          </div>

          <SignaturePad
            onSignatureChange={setSignature}
            width={380}
            height={180}
          />

          {/* Terms Acceptance */}
          <div className="flex items-start space-x-3 rounded-lg border bg-muted/30 p-4">
            <Checkbox
              id="accept-terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
              disabled={isSubmitting}
            />
            <Label
              htmlFor="accept-terms"
              className="text-sm leading-relaxed text-muted-foreground"
            >
              {t("acceptTermsLabel")}
            </Label>
          </div>

          {/* Signature Status */}
          {signature && acceptedTerms && (
            <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-700 dark:text-green-300">
                {t("readyToSign")}
              </AlertDescription>
            </Alert>
          )}

          {/* Actions - hide after signature is submitted */}
          {!externalSigned && (
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  {t("cancel")}
                </Button>
              )}
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("signing")}
                  </>
                ) : (
                  t(
                    signerRole === "renter"
                      ? "signAndContinue"
                      : "signContract",
                  )
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
