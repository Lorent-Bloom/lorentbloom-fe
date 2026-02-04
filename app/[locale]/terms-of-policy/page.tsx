import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCommonMetadata } from "@shared/lib/seo";
import { TermsOfPolicyPage } from "@views/terms-of-policy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms-of-policy" });
  const common = getCommonMetadata(locale, "terms-of-policy");

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    ...common,
  };
}

export default function Page() {
  return <TermsOfPolicyPage />;
}
