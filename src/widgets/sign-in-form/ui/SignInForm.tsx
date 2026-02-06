"use client";

import React, { FC } from "react";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PasswordInput,
} from "@shared/ui";
import { useSignInForm } from "../lib/useSignInForm";
import { SignInFormProps } from "../model/interface";
import { cn } from "@shared/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

const SignInForm: FC<SignInFormProps> = ({ className }) => {
  const { form, onFormSubmit, loading } = useSignInForm();
  const t = useTranslations("sign-in-form");
  const locale = useLocale();

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
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? t("submitting") : t("submit")}
        </Button>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">{t("noAccount")}</span>{" "}
          <Link
            href={`/${locale}/sign-up`}
            className="text-primary hover:underline font-medium"
          >
            {t("signUpLink")}
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default SignInForm;
