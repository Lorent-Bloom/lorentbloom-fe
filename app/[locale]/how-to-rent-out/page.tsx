import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { HowToRentOutView } from "@views/how-to-rent-out";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "how-to-rent-out");

  const titles: Record<string, string> = {
    en: "How to Rent",
    ru: "Как сдать в аренду",
    ro: "Cum să dai în chirie",
  };

  const descriptions: Record<string, string> = {
    en: "A complete guide to listing and renting out your items on Lorent Bloom in Moldova. Earn extra income from your electronics, tools, and equipment in Chișinău.",
    ru: "Полное руководство по размещению и сдаче вещей в аренду на Lorent Bloom в Молдове. Зарабатывайте на электронике, инструментах и оборудовании в Кишинёве.",
    ro: "Ghid complet pentru listarea și închirierea articolelor pe Lorent Bloom în Moldova. Câștigă venituri suplimentare din electronice, unelte și echipamente în Chișinău.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default function HowToRentOutPage() {
  return <HowToRentOutView />;
}
