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
    en: "A comprehensive guide to renting out your personal items and earning extra income on Rently.",
    ru: "Полное руководство по сдаче личных вещей в аренду и получению дополнительного дохода на Rently.",
    ro: "Un ghid complet pentru închirierea articolelor personale și câștigarea de venituri suplimentare pe Rently.",
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
