import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { ConfirmEmailPage } from "@views/confirm-email";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "customer/account/confirm");

  const titles: Record<string, string> = {
    en: "Confirm Email",
    ru: "Подтверждение email",
    ro: "Confirmare Email",
  };

  const descriptions: Record<string, string> = {
    en: "Confirm your email address to activate your Lorent Bloom account.",
    ru: "Подтвердите ваш email для активации аккаунта Lorent Bloom.",
    ro: "Confirmati adresa de email pentru a activa contul Lorent Bloom.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default ConfirmEmailPage;
