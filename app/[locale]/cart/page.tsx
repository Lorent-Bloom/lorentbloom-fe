import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { getCart } from "@entities/cart";
import { CartPage } from "@views/cart";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "cart", { noIndex: true });

  const titles: Record<string, string> = {
    en: "Shopping Cart",
    ru: "Корзина",
    ro: "Coș de cumpărături",
  };

  const descriptions: Record<string, string> = {
    en: "Review items in your cart before checkout.",
    ru: "Просмотрите товары в корзине перед оформлением.",
    ro: "Revizuiți articolele din coș înainte de finalizare.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default async function Cart() {
  const cartResponse = await getCart();
  const cart = cartResponse.success ? cartResponse.data || null : null;

  return <CartPage cart={cart} />;
}
