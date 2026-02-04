"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { FileText, Loader2, ExternalLink } from "lucide-react";
import type { DocumentPreviewProps } from "../model/interface";

export function DocumentPreview({
  pdfUrl,
  isLoading = false,
  className,
}: DocumentPreviewProps) {
  const t = useTranslations("document-signing");

  const handleOpenInNewTab = () => {
    if (!pdfUrl) return;

    // Convert base64 data URL to Blob for proper viewing
    if (pdfUrl.startsWith("data:application/pdf;base64,")) {
      const base64 = pdfUrl.replace("data:application/pdf;base64,", "");
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } else {
      window.open(pdfUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex h-[600px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {t("generatingPreview")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!pdfUrl) {
    return (
      <Card className={className}>
        <CardContent className="flex h-[600px] items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <FileText className="h-12 w-12" />
            <p className="text-sm">{t("noPreviewAvailable")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            {t("contractPreview")}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenInNewTab}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {t("openFullScreen")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border bg-muted/30">
          <iframe
            src={pdfUrl}
            className="h-[600px] w-full"
            title={t("contractPreview")}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {t("previewDisclaimer")}
        </p>
      </CardContent>
    </Card>
  );
}
