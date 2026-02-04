"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { SigningFlow } from "@features/document-signing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@shared/ui/alert";
import { Button } from "@shared/ui/button";
import {
  FileSignature,
  CheckCircle2,
  AlertCircle,
  Download,
} from "lucide-react";
import { useSignContractPage } from "../lib/useSignContractPage";
import type { SignContractPageProps } from "../model/interface";

export default function SignContractPage({
  orderId,
  document,
  order,
  customer,
  locale,
  error,
}: SignContractPageProps) {
  const t = useTranslations("document-signing");

  const {
    isSubmitting,
    pdfUrl,
    isSigned,
    contractPreviewData,
    existingPersonalNumber,
    loadPdf,
    handleSign,
  } = useSignContractPage(document, order, customer, locale);

  useEffect(() => {
    loadPdf();
  }, [loadPdf]);

  // Error state
  if (error) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Document not found
  if (!document || !order) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Document Not Found</AlertTitle>
          <AlertDescription>
            The contract document could not be found. Please contact support.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Already fully signed
  if (document.status === "signed") {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              {t("contractSigned")}
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">
              {t("contractSignedDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pdfUrl && (
              <Button asChild>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  {t("downloadContract")}
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Owner already signed (shouldn't happen in normal flow)
  if (document.owner_signature) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Already Signed</AlertTitle>
          <AlertDescription>
            You have already signed this contract.
            {document.status === "partially_signed" && (
              <span> {t("waitingForOwner")}</span>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Just signed - success state
  if (isSigned) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle2 className="h-5 w-5" />
              {t("contractSigned")}
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">
              {t("contractSignedDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Redirecting to your orders...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main signing flow
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("ownerSigningTitle")}</h1>
        <p className="mt-2 text-muted-foreground">
          {t("ownerSigningDescription")}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Order: <span className="font-medium">{orderId}</span>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            {t("signContractTitle")}
          </CardTitle>
          <CardDescription>{t("signContractDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {contractPreviewData ? (
            <SigningFlow
              contractData={contractPreviewData}
              onSign={handleSign}
              isSubmitting={isSubmitting}
              isSigned={isSigned}
              signerRole="owner"
              existingPersonalNumber={existingPersonalNumber}
            />
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Unable to load contract data. Please try again later.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
