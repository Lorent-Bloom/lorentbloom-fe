import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { WishlistPage } from "@views/wishlist";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "wishlist", { noIndex: true });

  const titles: Record<string, string> = {
    en: "Wishlist",
    ru: "Избранное",
    ro: "Lista de dorințe",
  };

  const descriptions: Record<string, string> = {
    en: "Your saved items on Lorent Bloom.",
    ru: "Ваши сохранённые товары на Lorent Bloom.",
    ro: "Articolele salvate pe Lorent Bloom.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default function Page() {
  return <WishlistPage />;
}
