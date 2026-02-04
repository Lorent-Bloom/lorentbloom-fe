import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { SignUpPage } from "@views/sign-up";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "sign-up");

  const titles: Record<string, string> = {
    en: "Sign Up",
    ru: "Регистрация",
    ro: "Înregistrare",
  };

  const descriptions: Record<string, string> = {
    en: "Create your Minimum account to start renting and listing items.",
    ru: "Создайте аккаунт Minimum, чтобы начать арендовать и размещать товары.",
    ro: "Creați-vă contul Minimum pentru a începe să închiriați și să listați articole.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default SignUpPage;
