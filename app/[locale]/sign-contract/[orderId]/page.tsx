import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { SignContractPage } from "@views/sign-contract";
import { getDocumentByOrderId } from "@entities/document";
import { getOrderDetail, getRentalOrderDetail } from "@entities/order";
import { getCustomer } from "@entities/customer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; orderId: string }>;
}): Promise<Metadata> {
  const { locale, orderId } = await params;
  const common = getCommonMetadata(locale, `sign-contract/${orderId}`, {
    noIndex: true,
  });

  const titles: Record<string, string> = {
    en: "Sign Contract",
    ru: "Подписание договора",
    ro: "Semnare contract",
  };

  const descriptions: Record<string, string> = {
    en: "Review and sign your rental contract.",
    ru: "Просмотрите и подпишите договор аренды.",
    ro: "Revizuiți și semnați contractul de închiriere.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default async function SignContract({
  params,
}: {
  params: Promise<{ locale: string; orderId: string }>;
}) {
  const { locale, orderId } = await params;

  // Fetch document, order, and customer data in parallel
  const [documentResult, customer] = await Promise.all([
    getDocumentByOrderId(orderId),
    getCustomer(),
  ]);

  // Try to get order - first as renter (customer.orders), then as owner (myRentalOrders)
  let orderResult = await getOrderDetail(orderId);
  if (!orderResult.success) {
    // If not found as renter, try as owner
    orderResult = await getRentalOrderDetail(orderId);
  }

  // Handle errors
  let error: string | undefined;
  if (!documentResult.success) {
    error = documentResult.error || "Document not found";
  }
  if (!orderResult.success && !error) {
    error = orderResult.error || "Order not found";
  }

  return (
    <SignContractPage
      orderId={orderId}
      document={documentResult.data || null}
      order={orderResult.data || null}
      customer={customer}
      locale={locale}
      error={error}
    />
  );
}
