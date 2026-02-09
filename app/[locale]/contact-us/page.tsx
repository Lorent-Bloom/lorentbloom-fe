import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { ContactView } from "@views/contact";
import { getCustomer } from "@entities/customer";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const common = getCommonMetadata(locale, "contact-us");

  const titles: Record<string, string> = {
    en: "Contact Us",
    ru: "Связаться с нами",
    ro: "Contactați-ne",
  };

  const descriptions: Record<string, string> = {
    en: "Contact the Lorent Bloom team in Chișinău, Moldova. Questions about rentals, partnerships, or feedback — we're here to help.",
    ru: "Свяжитесь с командой Lorent Bloom в Кишинёве, Молдова. Вопросы об аренде, партнёрстве или отзывы — мы готовы помочь.",
    ro: "Contactați echipa Lorent Bloom din Chișinău, Moldova. Întrebări despre închirieri, parteneriate sau feedback — suntem aici să vă ajutăm.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    ...common,
  };
}

export default async function ContactPage() {
  const customer = await getCustomer();

  const defaultName = customer
    ? `${customer.firstname || ""} ${customer.lastname || ""}`.trim()
    : undefined;
  const defaultEmail = customer?.email;

  return <ContactView defaultName={defaultName} defaultEmail={defaultEmail} />;
}
