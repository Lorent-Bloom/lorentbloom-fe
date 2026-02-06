import type { Metadata } from "next";
import { getCommonMetadata } from "@shared/lib/seo";
import { ContactView } from "@views/contact";
import { getCustomer } from "@entities/customer";

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
    en: "Get in touch with the Lorent Bloom team. We're here to help with any questions or feedback.",
    ru: "Свяжитесь с командой Lorent Bloom. Мы готовы помочь с любыми вопросами или отзывами.",
    ro: "Contactați echipa Lorent Bloom. Suntem aici pentru a vă ajuta cu orice întrebări sau feedback.",
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
