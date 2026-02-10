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
    en: "Rent & Lend Items Easily Online | Lorent Bloom",
    ru: "Аренда и прокат вещей онлайн | Lorent Bloom",
    ro: "Închiriază și împrumută ușor online | Lorent Bloom",
  };

  const descriptions: Record<string, string> = {
    en: "Rent electronics, tools, equipment and more in Chișinău, Moldova. Affordable daily and monthly peer-to-peer rentals.",
    ru: "Аренда электроники, инструментов и оборудования в Кишинёве. Доступная посуточная и помесячная аренда.",
    ro: "Închiriază electronice, unelte și echipamente în Chișinău, Moldova. Închirieri accesibile pe zi și pe lună.",
  };

  return {
    title: { absolute: titles[locale] || titles.en },
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default HomePage;
