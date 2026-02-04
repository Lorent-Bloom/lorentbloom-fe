import React from "react";
import { FaqList } from "@widgets/faq-list";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { FaqPageProps } from "../model/interface";

const FaqPage = async ({ params }: FaqPageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("faq");

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground text-lg">{t("subtitle")}</p>
      </div>
      <FaqList />
    </div>
  );
};

export default FaqPage;
