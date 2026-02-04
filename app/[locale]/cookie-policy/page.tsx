import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCommonMetadata } from "@shared/lib/seo";
import { CookiePolicyPage } from "@views/cookie-policy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cookie-policy" });
  const common = getCommonMetadata(locale, "cookie-policy");

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    ...common,
  };
}

export default function Page() {
  return <CookiePolicyPage />;
}
