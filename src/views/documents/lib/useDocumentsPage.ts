"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { getContractPdfUrl } from "@features/document-signing";
import type { DocumentWithRole } from "@entities/document";
import type { DocumentsPageProps } from "../model/interface";

export const useDocumentsPage = ({ documents }: DocumentsPageProps) => {
  const t = useTranslations("documents");
  const router = useRouter();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const hasDocuments = documents.length > 0;

  const handleDownload = useCallback(async (doc: DocumentWithRole) => {
    if (doc.status !== "signed") return;

    setDownloadingId(doc.id);
    try {
      const result = await getContractPdfUrl(doc.order_id);
      if (result.success && result.url) {
        window.open(result.url, "_blank");
      }
    } catch (error) {
      console.error("Failed to download document:", error);
    } finally {
      setDownloadingId(null);
    }
  }, []);

  const handleSign = useCallback(
    (doc: DocumentWithRole) => {
      router.push(`/sign-contract/${doc.order_id}`);
    },
    [router],
  );

  const getStatusLabel = useCallback(
    (status: string) => {
      switch (status) {
        case "signed":
          return t("status.signed");
        case "partially_signed":
          return t("status.partiallySigned");
        case "pending":
          return t("status.pending");
        default:
          return status;
      }
    },
    [t],
  );

  const getStatusVariant = useCallback(
    (status: string): "default" | "secondary" | "destructive" | "outline" => {
      switch (status) {
        case "signed":
          return "secondary";
        case "partially_signed":
          return "outline";
        case "pending":
          return "default";
        default:
          return "default";
      }
    },
    [],
  );

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  const getOrderLink = useCallback((doc: DocumentWithRole) => {
    // Both owner and renter navigate to order view page
    return `/account/order/view/${doc.order_id}`;
  }, []);

  return {
    t,
    hasDocuments,
    downloadingId,
    handleDownload,
    handleSign,
    getStatusLabel,
    getStatusVariant,
    formatDate,
    getOrderLink,
  };
};
