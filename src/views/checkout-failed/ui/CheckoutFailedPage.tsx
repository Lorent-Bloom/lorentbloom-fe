"use client";

import { XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Alert, AlertDescription } from "@shared/ui/alert";
import { useCheckoutFailedPage } from "../lib/useCheckoutFailedPage";
import type { CheckoutFailedPageProps } from "../model/interface";

export default function CheckoutFailedPage({ error }: CheckoutFailedPageProps) {
  const {
    error: errorMessage,
    handleRetry,
    handleBackToCart,
  } = useCheckoutFailedPage(error);
  const t = useTranslations("checkout-failed");

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="mx-auto max-w-2xl p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold">{t("title")}</h1>

        <p className="mb-6 text-lg text-muted-foreground">
          {t("errorMessage")}
        </p>

        <Alert variant="destructive" className="mb-8">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>

        <p className="mb-8 text-sm text-muted-foreground">{t("helpText")}</p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button onClick={handleRetry} variant="default">
            {t("tryAgainButton")}
          </Button>
          <Button onClick={handleBackToCart} variant="outline">
            {t("backToCartButton")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
