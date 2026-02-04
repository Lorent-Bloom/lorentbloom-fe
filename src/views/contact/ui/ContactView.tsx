"use client";

import { useTranslations } from "next-intl";
import { ContactForm } from "@widgets/contact-form";

interface ContactViewProps {
  defaultName?: string;
  defaultEmail?: string;
}

export function ContactView({ defaultName, defaultEmail }: ContactViewProps) {
  const t = useTranslations("contact");

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
      <p className="text-lg text-muted-foreground mb-8">{t("subtitle")}</p>

      <ContactForm defaultName={defaultName} defaultEmail={defaultEmail} />
    </div>
  );
}
