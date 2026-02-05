"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  submitContractSignature,
  finalizeContract,
  getContractPdfUrl,
} from "@features/document-signing";
import type { ContractPreviewData } from "@features/document-signing";
import type { SignatureMethod } from "@entities/document";
import type { Document } from "@entities/document";
import type { OrderDetail } from "@entities/order";
import type { Customer } from "@entities/customer";
import { getCustomAttributeValue } from "@entities/customer";

export function useSignContractPage(
  document: Document | null,
  order: OrderDetail | null,
  customer: Customer | null,
  locale: string,
) {
  const router = useRouter();
  const t = useTranslations("document-signing");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  // Build contract preview data from order
  const contractPreviewData = useMemo((): ContractPreviewData | null => {
    if (!order) return null;

    const orderNumber = order.number || order.order_number || "";
    const orderDate =
      order.order_date || order.created_at || new Date().toISOString();
    const firstItem = order.items[0];

    if (!firstItem) return null;

    // Calculate rental days
    const rentFrom = firstItem.rent_from_date
      ? new Date(firstItem.rent_from_date)
      : new Date();
    const rentTo = firstItem.rent_to_date
      ? new Date(firstItem.rent_to_date)
      : new Date();
    const totalDays = Math.max(
      1,
      Math.ceil(
        (rentTo.getTime() - rentFrom.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );

    // Owner info from parent_customer_info
    const ownerInfo = order.parent_customer_info;
    const renterInfo = order.customer_info;

    return {
      contractNumber: orderNumber,
      contractDate: new Date(orderDate).toLocaleDateString("ro-RO"),
      ownerName: ownerInfo
        ? `${ownerInfo.firstname || ""} ${ownerInfo.lastname || ""}`.trim()
        : "Owner",
      ownerEmail: ownerInfo?.email || "",
      ownerPhone: ownerInfo?.telephone || "",
      ownerAddress: order.shipping_address
        ? `${order.shipping_address.street.join(", ")}, ${order.shipping_address.city}`
        : "",
      ownerPersonalNumber: document?.owner_personal_number || undefined,
      renterName: `${renterInfo.firstname} ${renterInfo.lastname || ""}`.trim(),
      renterEmail: renterInfo.email || "",
      renterPhone: renterInfo.telephone || "",
      renterAddress: order.billing_address
        ? `${order.billing_address.street.join(", ")}, ${order.billing_address.city}`
        : "",
      renterPersonalNumber: document?.renter_personal_number || undefined,
      productName: firstItem.product_name,
      productSku: firstItem.product_sku,
      rentFromDate: rentFrom.toLocaleDateString("ro-RO"),
      rentToDate: rentTo.toLocaleDateString("ro-RO"),
      totalDays,
      totalPrice: order.total.grand_total.value.toFixed(2),
      currency: order.total.grand_total.currency,
      paymentMethod: order.payment_methods[0]?.name || "Cash",
      existingRenterSignature: document?.renter_signature?.data,
    };
  }, [order, document]);

  // Load existing PDF if available
  const loadPdf = useCallback(async () => {
    if (!order) return;

    setIsLoadingPdf(true);
    try {
      const orderNumber = order.number || order.order_number;
      if (orderNumber) {
        const result = await getContractPdfUrl(orderNumber);
        if (result.success && result.url) {
          setPdfUrl(result.url);
        }
      }
    } catch (error) {
      console.error("Failed to load PDF:", error);
    } finally {
      setIsLoadingPdf(false);
    }
  }, [order]);

  const handleSign = useCallback(
    async (
      signatureData: string,
      method: SignatureMethod,
      personalNumber?: string,
    ) => {
      if (!document || !order || !contractPreviewData) {
        toast.error(t("missingContractData"));
        return;
      }

      // Get owner info
      const ownerInfo = order.parent_customer_info;
      if (!ownerInfo?.email) {
        toast.error("Owner information not found");
        return;
      }

      setIsSubmitting(true);

      try {
        // Submit owner signature with personal number
        const signResult = await submitContractSignature({
          documentId: document.id,
          signatureData,
          method,
          signerName:
            `${ownerInfo.firstname || ""} ${ownerInfo.lastname || ""}`.trim(),
          signerEmail: ownerInfo.email,
          signerPersonalNumber: personalNumber,
          signerRole: "owner",
        });

        if (!signResult.success) {
          toast.error(signResult.error || t("failedToSign"));
          return;
        }

        // Finalize the contract (generate final PDF with both signatures)
        const orderNumber = order.number || order.order_number;
        if (orderNumber) {
          const finalizeResult = await finalizeContract(
            orderNumber,
            contractPreviewData,
          );

          if (!finalizeResult.success) {
            console.error("Failed to finalize contract:", finalizeResult.error);
            // Don't fail the signing, just log
          }
        }

        setIsSigned(true);
        toast.success(t("contractSigned"));

        // Redirect to documents page after a short delay
        setTimeout(() => {
          router.push(`/${locale}/account/documents`);
        }, 2000);
      } catch (error) {
        console.error("Sign contract error:", error);
        toast.error(t("failedToSign"));
      } finally {
        setIsSubmitting(false);
      }
    },
    [document, order, contractPreviewData, locale, router, t],
  );

  // Get owner's existing personal number from customer account (priority) or document
  const existingPersonalNumber = useMemo(() => {
    // First try to get from customer's account custom attributes
    if (customer) {
      const customerPersonalNumber = getCustomAttributeValue(
        customer,
        "personal_number",
      );
      if (customerPersonalNumber) {
        return customerPersonalNumber;
      }
    }
    // Fall back to document if available
    return document?.owner_personal_number || undefined;
  }, [customer, document]);

  return {
    isSubmitting,
    pdfUrl,
    isLoadingPdf,
    isSigned,
    contractPreviewData,
    existingPersonalNumber,
    loadPdf,
    handleSign,
  };
}
