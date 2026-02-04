import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { getCustomerAddresses } from "@entities/customer-address";
import { getTranslations, getLocale } from "next-intl/server";
import { AddressList } from "@features/address-management";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "account/addresses", {
    noIndex: true,
  });

  const titles: Record<string, string> = {
    en: "My Addresses",
    ru: "Мои адреса",
    ro: "Adresele mele",
  };

  const descriptions: Record<string, string> = {
    en: "Manage your shipping and billing addresses.",
    ru: "Управляйте адресами доставки и оплаты.",
    ro: "Gestionați adresele de livrare și facturare.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default async function AddressesPage() {
  const addresses = await getCustomerAddresses();
  const locale = await getLocale();
  const t = await getTranslations("address-management");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{t("addressesTitle")}</h2>
        <p className="text-muted-foreground mt-1">
          {t("addressesDescription")}
        </p>
      </div>
      <AddressList addresses={addresses} locale={locale} />
    </div>
  );
}
