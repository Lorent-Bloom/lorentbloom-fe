"use client";

import { useUnifiedAccountSettings } from "../lib/useUnifiedAccountSettings";
import type { UnifiedAccountSettingsFormProps } from "../model/interface";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import { Input } from "@shared/ui/input";
import { PasswordInput, PhoneInput, IdnpInput } from "@shared/ui";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Checkbox } from "@shared/ui/checkbox";
import { Separator } from "@shared/ui/separator";

export default function UnifiedAccountSettingsForm({
  defaultValues,
  locale,
  highlightField,
}: UnifiedAccountSettingsFormProps) {
  const {
    form,
    onSubmit,
    isSubmitting,
    enabledSections,
    toggleSection,
    highlightField: fieldToHighlight,
    t,
  } = useUnifiedAccountSettings({ defaultValues, locale, highlightField });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Section - Always Visible */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem data-tour="settings-firstname">
                    <FormLabel>{t("fields.firstname")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem data-tour="settings-lastname">
                    <FormLabel>{t("fields.lastname")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telephone"
                render={({ field }) => (
                  <FormItem data-tour="settings-phone">
                    <FormLabel>{t("fields.telephone")}</FormLabel>
                    <FormControl>
                      <PhoneInput
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="personal_number"
                render={({ field }) => (
                  <FormItem data-tour="settings-idnp">
                    <FormLabel
                      className={
                        fieldToHighlight === "personal_number"
                          ? "text-destructive"
                          : undefined
                      }
                    >
                      {t("fields.personal_number")}
                    </FormLabel>
                    <FormControl>
                      <IdnpInput
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        className={
                          fieldToHighlight === "personal_number"
                            ? "border-destructive ring-destructive focus-visible:ring-destructive"
                            : undefined
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Shared Current Password - Show once if both email and password are enabled */}
            {enabledSections.email && enabledSections.password && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.currentPassword")}</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {(enabledSections.email || enabledSections.password) &&
              enabledSections.email &&
              enabledSections.password && <Separator />}

            {/* Email Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enable-email"
                  checked={enabledSections.email}
                  onCheckedChange={() => toggleSection("email")}
                />
                <label
                  htmlFor="enable-email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {t("sections.email")}
                </label>
              </div>

              {enabledSections.email && (
                <div className="ml-6 space-y-4 border-l-2 border-secondary pl-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.email")}</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Only show current password if password section is not enabled */}
                  {!enabledSections.password && (
                    <FormField
                      control={form.control}
                      name="currentPasswordForEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("fields.currentPassword")}</FormLabel>
                          <FormControl>
                            <PasswordInput {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}
            </div>

            <Separator />

            {/* Password Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enable-password"
                  checked={enabledSections.password}
                  onCheckedChange={() => toggleSection("password")}
                />
                <label
                  htmlFor="enable-password"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {t("sections.password")}
                </label>
              </div>

              {enabledSections.password && (
                <div className="ml-6 space-y-4 border-l-2 border-secondary pl-4">
                  {/* Only show current password if email section is not enabled */}
                  {!enabledSections.email && (
                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("fields.currentPassword")}</FormLabel>
                          <FormControl>
                            <PasswordInput {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.newPassword")}</FormLabel>
                        <FormControl>
                          <PasswordInput {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.confirmPassword")}</FormLabel>
                        <FormControl>
                          <PasswordInput {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <Separator />

            <Button type="submit" disabled={isSubmitting} data-tour="settings-save">
              {isSubmitting ? t("saving") : t("saveChanges")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
