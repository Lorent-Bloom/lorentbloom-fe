"use client";

import { useTranslations } from "next-intl";
import { Card } from "@shared/ui/card";
import { Label } from "@shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@shared/ui/radio-group";
import { Skeleton } from "@shared/ui/skeleton";
import { usePaymentMethodSelector } from "../lib/usePaymentMethodSelector";
import type { PaymentMethodSelectorProps } from "../model/interface";

export default function PaymentMethodSelector({
  cartId,
  selectedMethod,
  onMethodSelected,
  className,
}: PaymentMethodSelectorProps) {
  const t = useTranslations("checkout-payment");
  const { methods, isLoading, error } = usePaymentMethodSelector(cartId);

  if (error) {
    return (
      <Card className={className}>
        <div className="p-6">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <div className="space-y-4 p-6">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Card>
    );
  }

  if (methods.length === 0) {
    return (
      <Card className={className}>
        <div className="p-6">
          <p className="text-sm text-muted-foreground">
            {t("noPaymentMethods")}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="space-y-4 p-6">
        <h3 className="text-lg font-semibold">{t("selectPaymentMethod")}</h3>
        <RadioGroup
          value={selectedMethod || ""}
          onValueChange={onMethodSelected}
        >
          {methods.map((method) => (
            <div
              key={method.code}
              className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-accent/50 dark:hover:bg-accent/30"
            >
              <RadioGroupItem value={method.code} id={method.code} />
              <Label
                htmlFor={method.code}
                className="flex-1 cursor-pointer text-base font-normal"
              >
                {method.title}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </Card>
  );
}
