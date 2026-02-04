"use client";

import React from "react";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StarRatingInput,
} from "@shared/ui";
import { cn } from "@shared/lib/utils";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { useWriteReviewForm } from "../lib/useWriteReviewForm";
import type { WriteReviewFormProps } from "../model/interface";

export default function WriteReviewForm({
  productSku,
  className,
  onReviewSubmitted,
}: WriteReviewFormProps) {
  const t = useTranslations("write-review");
  const {
    form,
    onFormSubmit,
    isSubmitting,
    ratingsMetadata,
    isLoadingMetadata,
  } = useWriteReviewForm(productSku, onReviewSubmitted);

  if (isLoadingMetadata) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="text-xl font-semibold">{t("title")}</h3>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Overall Rating Field */}
          <FormField
            control={form.control}
            name="overallRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("overallRating")}</FormLabel>
                <FormControl>
                  <StarRatingInput
                    value={field.value}
                    onChange={field.onChange}
                    size="lg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nickname Field */}
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("nickname")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("nicknamePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Summary Field */}
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("summary")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("summaryPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Review Text Field */}
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("review")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("reviewPlaceholder")}
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Dynamic Rating Fields */}
          {ratingsMetadata.map((rating) => (
            <FormField
              key={rating.id}
              control={form.control}
              name={`ratings.${rating.id}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{rating.name}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectRating")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rating.values.map((value) => (
                        <SelectItem key={value.value_id} value={value.value_id}>
                          {value.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {t("submitting")}
              </>
            ) : (
              t("submit")
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
