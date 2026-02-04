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
    en: "Find answers to common questions about our rental platform",
    ru: "Найдите ответы на распространенные вопросы о нашей платформе аренды",
    ro: "Găsiți răspunsuri la întrebările comune despre platforma noastră de închiriere",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default FaqPage;
