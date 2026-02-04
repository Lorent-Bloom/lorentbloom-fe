import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { getCustomer, getCustomAttributeValue } from "@entities/customer";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { CompanySettingsForm } from "@features/company-settings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "account/company", {
    noIndex: true,
  });

  const titles: Record<string, string> = {
    en: "Company Settings",
    ru: "Настройки компании",
    ro: "Setări companie",
  };

  const descriptions: Record<string, string> = {
    en: "Manage your company information.",
    ru: "Управляйте информацией о компании.",
    ro: "Gestionați informațiile companiei.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default async function CompanyPage() {
  const customer = await getCustomer();
  const locale = await getLocale();

  if (!customer) {
    redirect(`/${locale}/sign-in`);
  }

  const companyData = {
    companyName: getCustomAttributeValue(customer, "company") || "",
    companyPhone: getCustomAttributeValue(customer, "company_phone") || "",
    companyLogo: getCustomAttributeValue(customer, "company_logo") || "",
  };

  return (
    <div className="space-y-6">
      <CompanySettingsForm defaultValues={companyData} locale={locale} />
    </div>
  );
}
