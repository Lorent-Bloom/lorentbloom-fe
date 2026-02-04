import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getCustomer } from "@entities/customer";
import { getRentedProduct } from "@entities/rented-product";
import { RentalForm } from "@features/rental-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "account/my-rents/edit", {
    noIndex: true,
  });

  const titles: Record<string, string> = {
    en: "Edit Rental",
    ru: "Редактировать аренду",
    ro: "Editare închiriere",
  };

  const descriptions: Record<string, string> = {
    en: "Edit your rental details.",
    ru: "Редактируйте детали аренды.",
    ro: "Editați detaliile închirierii.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRentalPage({ params }: PageProps) {
  const locale = await getLocale();
  const t = await getTranslations("rental-form");
  const customer = await getCustomer();

  if (!customer) {
    redirect(`/${locale}/sign-in`);
  }

  const { id } = await params;
  const result = await getRentedProduct(id);

  if (!result.success || !result.data) {
    redirect(`/${locale}/rented-products`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href={`/${locale}/rented-products`}
          className="hover:text-foreground"
        >
          {t("breadcrumb.rentedProducts")}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{t("breadcrumb.editRental")}</span>
      </nav>

      <RentalForm rental={result.data} />
    </div>
  );
}
