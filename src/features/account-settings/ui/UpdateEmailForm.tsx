"use client";

import { useUpdateEmailForm } from "../lib/useUpdateEmailForm";
import type { UpdateEmailFormProps } from "../model/interface";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import { Input } from "@shared/ui/input";
import PasswordInput from "@shared/ui/PasswordInput";
import { Button } from "@shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/card";

export default function UpdateEmailForm({
  currentEmail,
  locale,
}: UpdateEmailFormProps) {
  const { form, onSubmit, isSubmitting, t } = useUpdateEmailForm({
    currentEmail,
    locale,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("updateEmail")}</CardTitle>
        <CardDescription>{t("updateEmailDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("currentPassword")}</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
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
