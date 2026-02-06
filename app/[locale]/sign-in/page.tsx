import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { SignInPage } from "@views/sign-in";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "sign-in");

  const titles: Record<string, string> = {
    en: "Sign In",
    ru: "Вход",
    ro: "Autentificare",
  };

  const descriptions: Record<string, string> = {
    en: "Sign in to your Lorent Bloom account to manage rentals and listings.",
    ru: "Войдите в свой аккаунт Lorent Bloom для управления арендой и объявлениями.",
    ro: "Autentificați-vă în contul Lorent Bloom pentru a gestiona închirierile și anunțurile.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default SignInPage;
