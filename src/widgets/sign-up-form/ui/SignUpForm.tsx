"use client";

import React, { FC } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PasswordInput,
} from "@shared/ui";
import { useSignUpForm } from "../lib/useSignUpForm";
import { SignUpFormProps } from "../model/interface";
import { cn } from "@shared/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { MailCheck } from "lucide-react";

const SignUpForm: FC<SignUpFormProps> = ({ className }) => {
  const { form, onFormSubmit, loading, isSuccess } = useSignUpForm();
  const t = useTranslations("sign-up-form");
  const locale = useLocale();

  if (isSuccess) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader className="items-center text-center">
          <MailCheck className="text-primary mb-2 size-12" />
          <CardTitle>{t("confirmEmail.title")}</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-center text-sm space-y-4">
          <p>{t("confirmEmail.description")}</p>
          <Link
            href={`/${locale}/sign-in`}
            className="text-primary hover:underline font-medium inline-block"
          >
            {t("confirmEmail.signInLink")}
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onFormSubmit)}
        className={cn("space-y-6", className)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input placeholder={t("emailPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("password")}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={t("passwordPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("firstname")}</FormLabel>
              <FormControl>
                <Input placeholder={t("firstnamePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("lastname")}</FormLabel>
              <FormControl>
                <Input placeholder={t("lastnamePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? t("submitting") : t("submit")}
        </Button>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">{t("haveAccount")}</span>{" "}
          <Link
            href={`/${locale}/sign-in`}
            className="text-primary hover:underline font-medium"
          >
            {t("signInLink")}
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
