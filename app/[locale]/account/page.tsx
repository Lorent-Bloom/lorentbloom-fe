import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { getCustomer, getCustomAttributeValue } from "@entities/customer";
import { getCustomerProducts } from "@entities/customer-product";
import { getCustomerAddresses } from "@entities/customer-address";
import { OnboardingStatus } from "@widgets/onboarding";
import { getTranslations, getLocale } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import Link from "next/link";
import { Mail, User, Edit, MapPin, Building } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "account", { noIndex: true });

  const titles: Record<string, string> = {
    en: "My Account",
    ru: "Мой аккаунт",
    ro: "Contul meu",
  };

  const descriptions: Record<string, string> = {
    en: "Manage your Lorent Bloom account information and settings.",
    ru: "Управляйте информацией и настройками вашего аккаунта Lorent Bloom.",
    ro: "Gestionați informațiile și setările contului dvs. Lorent Bloom.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default async function AccountPage() {
  const customer = await getCustomer();
  const [addresses, productsResult] = await Promise.all([
    getCustomerAddresses(),
    getCustomerProducts({ pageSize: 1, currentPage: 1 }),
  ]);
  const locale = await getLocale();
  const t = await getTranslations("account");

  if (!customer) {
    return null;
  }

  const personalNumber = getCustomAttributeValue(customer, "personal_number");
  const hasIdnp = Boolean(personalNumber?.trim());
  const hasProducts =
    productsResult.success && (productsResult.data?.total_count ?? 0) > 0;

  // Get default billing and shipping addresses
  const defaultBillingAddress = addresses?.find((addr) => addr.default_billing);
  const defaultShippingAddress = addresses?.find(
    (addr) => addr.default_shipping,
  );

  // TODO: Replace with actual customer company data from backend
  // For now, hide company card by default (set to null)
  // When backend is ready, check if customer has company data
  const hasCompany = false; // Will be: customer.company !== null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{t("accountInfo")}</h2>
        <p className="text-muted-foreground mt-1">
          {t("accountInfoDescription")}
        </p>
      </div>

      <div
        className={`grid grid-cols-1 gap-6 ${hasCompany ? "md:grid-cols-3" : "md:grid-cols-2"}`}
      >
        {/* Contact Information Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t("contactInformation")}</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href={`/${locale}/account/settings`}>
                <Edit className="h-4 w-4 mr-2" />
                {t("edit")}
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">{t("name")}</p>
                <p className="text-sm text-muted-foreground">
                  {customer.firstname} {customer.lastname}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">{t("email")}</p>
                <p className="text-sm text-muted-foreground">
                  {customer.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Addresses Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t("addresses")}</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href={`/${locale}/account/addresses`}>
                <Edit className="h-4 w-4 mr-2" />
                {t("edit")}
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {addresses && addresses.length > 0 ? (
              <>
                {defaultBillingAddress && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {t("defaultBillingAddress")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {defaultBillingAddress.street?.join(", ")}
                        {defaultBillingAddress.city &&
                          `, ${defaultBillingAddress.city}`}
                        {defaultBillingAddress.postcode &&
                          `, ${defaultBillingAddress.postcode}`}
                      </p>
                    </div>
                  </div>
                )}
                {defaultShippingAddress && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {t("defaultShippingAddress")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {defaultShippingAddress.street?.join(", ")}
                        {defaultShippingAddress.city &&
                          `, ${defaultShippingAddress.city}`}
                        {defaultShippingAddress.postcode &&
                          `, ${defaultShippingAddress.postcode}`}
                      </p>
                    </div>
                  </div>
                )}
                {!defaultBillingAddress && !defaultShippingAddress && (
                  <p className="text-sm text-muted-foreground">
                    {t("noDefaultAddresses")}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("noAddresses")}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Company Card - Only show if user has company */}
        {hasCompany && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t("companyInformation")}</CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/account/company`}>
                  <Edit className="h-4 w-4 mr-2" />
                  {t("edit")}
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{t("companyName")}</p>
                  <p className="text-sm text-muted-foreground">{t("notSet")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <OnboardingStatus hasIdnp={hasIdnp} hasProducts={hasProducts} />
    </div>
  );
}
