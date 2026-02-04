import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { CheckoutSuccessPage } from "@views/checkout-success";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "checkout/success", {
    noIndex: true,
  });

  const titles: Record<string, string> = {
    en: "Order Confirmed",
    ru: "Заказ подтверждён",
    ro: "Comandă confirmată",
  };

  const descriptions: Record<string, string> = {
    en: "Your order has been placed successfully.",
    ru: "Ваш заказ успешно оформлен.",
    ro: "Comanda dvs. a fost plasată cu succes.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default async function CheckoutSuccess({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;
  return <CheckoutSuccessPage orderNumber={params.order} />;
}
