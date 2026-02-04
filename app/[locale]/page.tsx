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
    en: "Minimum - Rental Marketplace",
    ru: "Minimum - Маркетплейс аренды",
    ro: "Minimum - Piața de închiriere",
  };

  const descriptions: Record<string, string> = {
    en: "Rent anything you need. Electronics, equipment, and more - easily and affordably on Minimum.",
    ru: "Арендуйте всё, что вам нужно. Электроника, оборудование и многое другое - легко и доступно на Minimum.",
    ro: "Închiriază orice ai nevoie. Electronică, echipamente și altele - ușor și accesibil pe Minimum.",
  };

  return {
    title: { absolute: titles[locale] || titles.en },
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default HomePage;
