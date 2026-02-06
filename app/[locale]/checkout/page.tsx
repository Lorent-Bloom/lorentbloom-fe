import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { redirect } from "next/navigation";
import { getCart } from "@entities/cart";
import { getCustomer } from "@entities/customer";
import { getCustomerAddresses } from "@entities/customer-address";
import { CheckoutPage } from "@views/checkout";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "checkout", { noIndex: true });

  const titles: Record<string, string> = {
    en: "Checkout",
    ru: "Оформление заказа",
    ro: "Finalizare comandă",
  };

  const descriptions: Record<string, string> = {
    en: "Complete your order on Lorent Bloom.",
    ru: "Завершите оформление заказа на Lorent Bloom.",
    ro: "Finalizați comanda pe Lorent Bloom.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default async function Checkout({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [cartResponse, savedAddresses, customer] = await Promise.all([
    getCart(),
    getCustomerAddresses(),
    getCustomer(),
  ]);

  if (cartResponse.error === "SESSION_EXPIRED") {
    redirect(`/${locale}/sign-in`);
  }

  if (
    !cartResponse.success ||
    !cartResponse.data ||
    !cartResponse.data.items ||
    cartResponse.data.items.length === 0
  ) {
    redirect(`/${locale}/cart`);
  }

  return (
    <CheckoutPage
      cart={cartResponse.data}
      savedAddresses={savedAddresses}
      locale={locale}
      customer={customer}
    />
  );
}
