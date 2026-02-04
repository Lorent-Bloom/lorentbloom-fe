"use client";

import { useCompanySettings } from "../lib/useCompanySettings";
import type { CompanySettingsFormProps } from "../model/interface";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import { Input } from "@shared/ui/input";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import LogoUploader from "./LogoUploader";

export default function CompanySettingsForm({
  defaultValues,
  locale,
}: CompanySettingsFormProps) {
  const { form, onSubmit, isSubmitting, t } = useCompanySettings({
    defaultValues,
    locale,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.companyName")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("placeholders.companyName")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.companyPhone")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={t("placeholders.companyPhone")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.companyLogo")}</FormLabel>
                  <FormControl>
                    <LogoUploader
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                      error={form.formState.errors.companyLogo?.message}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("saving") : t("saveChanges")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
