"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function ProductNotFound() {
  const locale = useLocale();
  const t = useTranslations("product-not-found");

  return (
    <div className="container flex min-h-[50vh] flex-col items-center justify-center py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">{t("title")}</h2>
        <p className="mt-2 text-muted-foreground">{t("description")}</p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href={`/${locale}/products`}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            {t("browseProducts")}
          </Link>
          <Link
            href={`/${locale}`}
            className="rounded-md border px-4 py-2 hover:bg-accent"
          >
            {t("goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
