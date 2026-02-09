import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { FaqPage } from "@views/faq";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "faq");

  const titles: Record<string, string> = {
    en: "FAQ",
    ru: "Часто задаваемые вопросы",
    ro: "Întrebări frecvente",
  };

  const descriptions: Record<string, string> = {
    en: "Frequently asked questions about renting on Lorent Bloom in Moldova. How to rent, pricing, delivery in Chișinău, and more.",
    ru: "Часто задаваемые вопросы об аренде на Lorent Bloom в Молдове. Как арендовать, цены, доставка в Кишинёве и другое.",
    ro: "Întrebări frecvente despre închirierea pe Lorent Bloom în Moldova. Cum să închiriezi, prețuri, livrare în Chișinău și altele.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default FaqPage;
