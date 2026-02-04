import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getCustomer } from "@entities/customer";
import { getOrderDetail, getRentalOrderDetail } from "@entities/order";
import { OrderDetailPage } from "@views/order-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; order_number: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "account/order", { noIndex: true });

  const titles: Record<string, string> = {
    en: "Order Details",
    ru: "Детали заказа",
    ro: "Detalii comandă",
  };

  const descriptions: Record<string, string> = {
    en: "View your order details and status.",
    ru: "Просмотрите детали и статус вашего заказа.",
    ro: "Vizualizați detaliile și statusul comenzii.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

interface PageProps {
  params: Promise<{
    order_number: string;
  }>;
}

export default async function OrderDetailRoute({ params }: PageProps) {
  const locale = await getLocale();
  const customer = await getCustomer();

  if (!customer) {
    redirect(`/${locale}/sign-in`);
  }

  const { order_number } = await params;

  // Try fetching as a buyer order first (orders the user placed)
  const buyerResult = await getOrderDetail(order_number);

  if (buyerResult.success && buyerResult.data) {
    return <OrderDetailPage order={buyerResult.data} />;
  }

  // If not found as buyer order, try fetching as a rental order (orders on user's products)
  const rentalResult = await getRentalOrderDetail(order_number);

  if (rentalResult.success && rentalResult.data) {
    return <OrderDetailPage order={rentalResult.data} isRentalOrder />;
  }

  redirect(`/${locale}/account`);
}
