import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { AboutView } from "@views/about";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "about");

  const titles: Record<string, string> = {
    en: "About Us",
    ru: "О нас",
    ro: "Despre noi",
  };

  const descriptions: Record<string, string> = {
    en: "Learn about Lorent Bloom, Moldova's rental marketplace connecting people in Chișinău and beyond. Our mission is to make renting easy and affordable.",
    ru: "Узнайте о Lorent Bloom — маркетплейсе аренды в Молдове, который объединяет людей в Кишинёве и по всей стране. Наша миссия — сделать аренду простой и доступной.",
    ro: "Aflați despre Lorent Bloom, piața de închiriere din Moldova care conectează oamenii din Chișinău și nu numai. Misiunea noastră este să facem închirierea ușoară și accesibilă.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default function AboutPage() {
  return <AboutView />;
}
