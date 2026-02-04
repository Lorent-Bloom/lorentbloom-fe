import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { getCustomer } from "@entities/customer";
import { getCustomerOrders } from "@entities/order";
import { OrdersTable } from "@features/orders-table";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "account/my-rents", {
    noIndex: true,
  });

  const titles: Record<string, string> = {
    en: "My Rents",
    ru: "Мои аренды",
    ro: "Închirierile mele",
  };

  const descriptions: Record<string, string> = {
    en: "View your rental orders and history.",
    ru: "Просматривайте ваши заказы аренды и историю.",
    ro: "Vizualizați comenzile de închiriere și istoricul.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default async function MyOrdersPage() {
  const locale = await getLocale();
  const t = await getTranslations("orders-table");
  const customer = await getCustomer();

  if (!customer) {
    redirect(`/${locale}/sign-in`);
  }

  const result = await getCustomerOrders();

  if (!result.success || !result.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-destructive">{t("failedToLoadOrders")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <OrdersTable orders={result.data} locale={locale} />
    </div>
  );
}
