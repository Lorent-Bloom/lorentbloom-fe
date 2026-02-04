"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  Button,
  Switch,
} from "@shared/ui";
import { useTranslations } from "next-intl";
import type { CookiePreferencesSheetProps } from "../model/interface";

export function CookiePreferencesSheet({
  open,
  onOpenChange,
  preferences,
  onToggle,
  onSave,
  categories,
}: CookiePreferencesSheetProps) {
  const t = useTranslations("cookie-consent");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("preferences.title")}</SheetTitle>
          <SheetDescription>{t("preferences.description")}</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4 px-4">
          {categories.map((category) => (
            <div
              key={category.key}
              className="flex items-center justify-between gap-4 rounded-lg border p-4"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {t(`${category.translationKey}.title` as Parameters<typeof t>[0])}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t(`${category.translationKey}.description` as Parameters<typeof t>[0])}
                </p>
              </div>
              <Switch
                checked={preferences[category.key] === "granted"}
                onCheckedChange={() => onToggle(category.key)}
                disabled={category.isEssential}
                aria-label={t(`${category.translationKey}.title` as Parameters<typeof t>[0])}
              />
            </div>
          ))}
        </div>

        <SheetFooter className="px-4 pb-4">
          <Button
            onClick={onSave}
            className="w-full hover:bg-primary/90 dark:hover:bg-primary/80"
          >
            {t("preferences.save")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
