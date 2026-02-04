import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { getCustomer, getCustomAttributeValue } from "@entities/customer";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { UnifiedAccountSettingsForm } from "@features/unified-account-settings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "account/settings", {
    noIndex: true,
  });

  const titles: Record<string, string> = {
    en: "Account Settings",
    ru: "Настройки аккаунта",
    ro: "Setări cont",
  };

  const descriptions: Record<string, string> = {
    en: "Update your personal information and preferences.",
    ru: "Обновите личную информацию и настройки.",
    ro: "Actualizați informațiile personale și preferințele.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

interface PageProps {
  searchParams: Promise<{
    highlight?: string;
  }>;
}

export default async function AccountSettingsPage({
  searchParams,
}: PageProps) {
  const customer = await getCustomer();
  const locale = await getLocale();

  if (!customer) {
    redirect(`/${locale}/sign-in`);
  }

  const params = await searchParams;
  const highlightField = params.highlight;

  return (
    <div className="space-y-6">
      <UnifiedAccountSettingsForm
        defaultValues={{
          firstname: customer.firstname || "",
          lastname: customer.lastname || "",
          email: customer.email || "",
          telephone: getCustomAttributeValue(customer, "telephone") || "",
          personal_number:
            getCustomAttributeValue(customer, "personal_number") || "",
        }}
        locale={locale}
        highlightField={highlightField}
      />
    </div>
  );
}
