import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { getCustomer } from "@entities/customer";
import { getMyProductsRentals } from "@entities/product-rental";
import { MyProductRentalsTable } from "@features/my-product-rentals-table";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "account/my-product-rentals", {
    noIndex: true,
  });

  const titles: Record<string, string> = {
    en: "My Product Rentals",
    ru: "Аренда моих товаров",
    ro: "Închirierile produselor mele",
  };

  const descriptions: Record<string, string> = {
    en: "Track rentals of your listed products.",
    ru: "Отслеживайте аренду ваших товаров.",
    ro: "Urmăriți închirierile produselor dvs.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default async function MyProductRentalsPage() {
  const locale = await getLocale();
  const t = await getTranslations("my-product-rentals-table");
  const customer = await getCustomer();

  if (!customer) {
    redirect(`/${locale}/sign-in`);
  }

  const result = await getMyProductsRentals({
    pageSize: 10,
    currentPage: 1,
  });

  if (!result.success || !result.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-destructive">{t("fetchError")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MyProductRentalsTable
        initialRentals={result.data.items}
        initialPageInfo={result.data.page_info}
        initialTotalCount={result.data.total_count}
        locale={locale}
      />
    </div>
  );
}
