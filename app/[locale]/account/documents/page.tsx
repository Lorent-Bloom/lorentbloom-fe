import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getCustomer } from "@entities/customer";
import { getDocumentsForUser } from "@entities/document";
import { DocumentsPage } from "@views/documents";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "account/documents", {
    noIndex: true,
  });

  const titles: Record<string, string> = {
    en: "Documents",
    ru: "Документы",
    ro: "Documente",
  };

  const descriptions: Record<string, string> = {
    en: "View and manage your rental documents and contracts.",
    ru: "Просматривайте и управляйте документами и договорами аренды.",
    ro: "Vizualizați și gestionați documentele și contractele de închiriere.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default async function DocumentsRoutePage() {
  const locale = await getLocale();
  const customer = await getCustomer();

  if (!customer) {
    redirect(`/${locale}/sign-in`);
  }

  const result = await getDocumentsForUser(customer.email);

  return (
    <div className="container mx-auto px-4 py-8">
      <DocumentsPage
        documents={result.data || []}
        userEmail={customer.email}
      />
    </div>
  );
}
