"use client";

import { useConfirmEmail } from "../lib/useConfirmEmail";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
} from "@shared/ui";
import { Alert, AlertDescription, AlertTitle } from "@shared/ui/alert";
import { CheckCircle, XCircle, Mail, Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { cn } from "@shared/lib/utils";
import { ConfirmEmailCardProps } from "../model/interface";

export const ConfirmEmailCard = ({
  className,
  email,
  confirmationKey,
  hasValidParams,
}: ConfirmEmailCardProps) => {
  const t = useTranslations("confirm-email");
  const locale = useLocale();
  const { handleConfirm, isLoading, isSuccess, error } = useConfirmEmail({
    email: email || "",
    confirmationKey: confirmationKey || "",
  });

  if (!hasValidParams) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            {t("invalidParams.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>{t("invalidParams.alertTitle")}</AlertTitle>
            <AlertDescription>
              {t("invalidParams.alertDescription")}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card className={cn(className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            {t("success.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>{t("success.description")}</AlertDescription>
          </Alert>
          <Button asChild className="w-full">
            <Link href={`/${locale}/sign-in`}>{t("success.signInButton")}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          {t("card.title")}
        </CardTitle>
        <CardDescription>{t("card.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm text-muted-foreground">{t("card.emailLabel")}</p>
          <p className="font-medium">{email}</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>{t("error.title")}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button onClick={handleConfirm} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("card.confirming")}
            </>
          ) : (
            t("card.confirmButton")
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
