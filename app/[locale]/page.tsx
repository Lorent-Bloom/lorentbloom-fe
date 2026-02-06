import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { HomePage } from "@views/home";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "");

  const titles: Record<string, string> = {
    en: "Lorent Bloom - Rental Marketplace",
    ru: "Lorent Bloom - Маркетплейс аренды",
    ro: "Lorent Bloom - Piața de închiriere",
  };

  const descriptions: Record<string, string> = {
    en: "Rent anything you need. Electronics, equipment, and more - easily and affordably on Lorent Bloom.",
    ru: "Арендуйте всё, что вам нужно. Электроника, оборудование и многое другое - легко и доступно на Lorent Bloom.",
    ro: "Închiriază orice ai nevoie. Electronică, echipamente și altele - ușor și accesibil pe Lorent Bloom.",
  };

  return {
    title: { absolute: titles[locale] || titles.en },
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default HomePage;
