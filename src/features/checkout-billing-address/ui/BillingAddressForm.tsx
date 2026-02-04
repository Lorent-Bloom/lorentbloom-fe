"use client";

import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import { Input } from "@shared/ui/input";
import { PhoneInput } from "@shared/ui/phone-input";
import { Button } from "@shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { useBillingAddressForm } from "../lib/useBillingAddressForm";
import type { BillingAddressFormProps } from "../model/interface";

export default function BillingAddressForm({
  onSubmit,
  isSubmitting = false,
  className,
}: BillingAddressFormProps) {
  const { form, handleSubmit } = useBillingAddressForm(onSubmit, isSubmitting);
  const t = useTranslations("checkout-billing-address");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("first_name")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholder_first_name")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("last_name")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholder_last_name")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="telephone"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>{t("phone_number")}</FormLabel>
              <FormControl>
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>{t("company_optional")}</FormLabel>
              <FormControl>
                <Input placeholder={t("placeholder_company")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="countryCode"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("country")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("select_country")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MD">{t("country_md")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("city")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholder_city")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="street.0"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("street_address")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("placeholder_street")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("postal_code")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("placeholder_postal_code")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="mt-6 w-full" disabled={isSubmitting}>
          {isSubmitting ? t("saving") : t("save_billing_address")}
        </Button>
      </form>
    </Form>
  );
}
