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
    en: "Learn more about Minimum and our mission to revolutionize the rental marketplace",
    ru: "Узнайте больше о Minimum и нашей миссии по революционизации рынка аренды",
    ro: "Aflați mai multe despre Minimum și misiunea noastră de a revoluționa piața închirierilor",
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
