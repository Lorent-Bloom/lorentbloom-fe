import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getCustomer, getCustomAttributeValue } from "@entities/customer";
import { getCustomerProducts } from "@entities/customer-product";
import { getCategoryTree } from "@entities/category";
import { getCities } from "@entities/city";
import { MyProductsPageClient } from "./MyProductsPageClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "account/my-products", {
    noIndex: true,
  });

  const titles: Record<string, string> = {
    en: "My Products",
    ru: "Мои товары",
    ro: "Produsele mele",
  };

  const descriptions: Record<string, string> = {
    en: "Manage your listed products on Minimum.",
    ru: "Управляйте вашими товарами на Minimum.",
    ro: "Gestionați produsele listate pe Minimum.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    includeDisabled?: string;
  }>;
}

export default async function MyProductsPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const customer = await getCustomer();

  if (!customer) {
    redirect(`/${locale}/sign-in`);
  }

  const params = await searchParams;
  const currentPage = parseInt(params.page || "1");
  const searchQuery = params.search || "";
  const includeDisabled = params.includeDisabled === "true";

  // The backend automatically filters products by the authenticated customer
  // Search parameter is sent to backend for server-side filtering
  // Filter by is_active: 1 = Active, 2 = Disabled
  const [result, categoriesResult, citiesResult] = await Promise.all([
    getCustomerProducts({
      currentPage: currentPage,
      pageSize: 10,
      search: searchQuery,
      filter: includeDisabled ? undefined : { is_active: { eq: "1" } },
    }),
    getCategoryTree(),
    getCities(),
  ]);

  // Check if user has IDNP set
  const personalNumber = getCustomAttributeValue(customer, "personal_number");
  const hasIdnp = Boolean(personalNumber && personalNumber.trim().length > 0);

  return (
    <MyProductsPageClient
      initialData={result.success ? result.data : null}
      error={result.success ? null : result.error || "Failed to load products"}
      locale={locale}
      includeDisabled={includeDisabled}
      categories={categoriesResult.data ?? []}
      cities={citiesResult.data ?? []}
      hasIdnp={hasIdnp}
    />
  );
}
