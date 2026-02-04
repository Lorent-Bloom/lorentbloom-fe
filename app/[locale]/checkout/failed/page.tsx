import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { CheckoutFailedPage } from "@views/checkout-failed";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "checkout/failed", {
    noIndex: true,
  });

  const titles: Record<string, string> = {
    en: "Payment Failed",
    ru: "Ошибка оплаты",
    ro: "Plata eșuată",
  };

  const descriptions: Record<string, string> = {
    en: "Your payment could not be processed. Please try again.",
    ru: "Платёж не может быть обработан. Пожалуйста, попробуйте снова.",
    ro: "Plata nu a putut fi procesată. Vă rugăm să încercați din nou.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default async function CheckoutFailed({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return <CheckoutFailedPage error={params.error} />;
}
