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
    en: "Lorent Bloom - Rent Anything in Moldova | Chișinău Rental Marketplace",
    ru: "Lorent Bloom - Аренда вещей в Молдове | Маркетплейс аренды Кишинёв",
    ro: "Lorent Bloom - Închiriază orice în Moldova | Piața de închiriere Chișinău",
  };

  const descriptions: Record<string, string> = {
    en: "Rent electronics, tools, equipment and more in Chișinău, Moldova. Lorent Bloom is your local peer-to-peer rental marketplace. Affordable daily and monthly rentals.",
    ru: "Аренда электроники, инструментов, оборудования и многого другого в Кишинёве, Молдова. Lorent Bloom — ваш локальный маркетплейс аренды. Доступная посуточная и помесячная аренда вещей.",
    ro: "Închiriază electronice, unelte, echipamente și altele în Chișinău, Moldova. Lorent Bloom este piața ta locală de închiriere. Închirieri accesibile pe zi și pe lună.",
  };

  return {
    title: { absolute: titles[locale] || titles.en },
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default HomePage;
