"use client";

import { useState, useCallback } from "react";
import type { SignatureMethod } from "@entities/document";
import type { ContractPreviewData } from "../model/interface";
import {
  generateContractPreview,
  submitContractSignature,
} from "../api/action/server";

export interface UseDocumentSigningReturn {
  isGenerating: boolean;
  isSubmitting: boolean;
  error: string | null;
  pdfUrl: string | null;
  generatePreview: (data: ContractPreviewData, locale?: string) => Promise<void>;
  submitSignature: (
    documentId: string,
    signatureData: string,
    method: SignatureMethod,
    signerInfo: {
      name: string;
      email: string;
      role: "owner" | "renter";
    }
  ) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

export function useDocumentSigning(): UseDocumentSigningReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const generatePreview = useCallback(async (data: ContractPreviewData, locale?: string) => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateContractPreview(data, locale);
      if (result.success && result.url) {
        setPdfUrl(result.url);
      } else {
        setError(result.error || "Failed to generate contract preview");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate contract"
      );
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const submitSignature = useCallback(
    async (
      documentId: string,
      signatureData: string,
      method: SignatureMethod,
      signerInfo: {
        name: string;
        email: string;
        role: "owner" | "renter";
      }
    ): Promise<{ success: boolean; error?: string }> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await submitContractSignature({
          documentId,
          signatureData,
          method,
          signerName: signerInfo.name,
          signerEmail: signerInfo.email,
          signerRole: signerInfo.role,
        });

        if (!result.success) {
          setError(result.error || "Failed to submit signature");
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to submit signature";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isGenerating,
    isSubmitting,
    error,
    pdfUrl,
    generatePreview,
    submitSignature,
    clearError,
  };
}
