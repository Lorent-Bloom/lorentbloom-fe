"use client";

import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { useCheckoutSuccessPage } from "../lib/useCheckoutSuccessPage";
import type { CheckoutSuccessPageProps } from "../model/interface";

export default function CheckoutSuccessPage({
  orderNumber,
}: CheckoutSuccessPageProps) {
  const { handleContinueShopping, handleViewOrder } =
    useCheckoutSuccessPage(orderNumber);
  const t = useTranslations("checkout-success");

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="mx-auto max-w-2xl p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold">{t("title")}</h1>

        <p className="mb-6 text-lg text-muted-foreground">
          {t("thankYouMessage")}
        </p>

        {orderNumber && (
          <div className="mb-8 rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              {t("orderNumberLabel")}
            </p>
            <p className="text-2xl font-bold">{orderNumber}</p>
          </div>
        )}

        <p className="mb-8 text-sm text-muted-foreground">
          {t("confirmationEmailMessage")}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button onClick={handleViewOrder} variant="default">
            {t("viewOrderButton")}
          </Button>
          <Button onClick={handleContinueShopping} variant="outline">
            {t("continueShoppingButton")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
