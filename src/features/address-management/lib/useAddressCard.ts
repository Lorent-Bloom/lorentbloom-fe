"use client";

import { useTranslations } from "next-intl";

export const useAddressCard = () => {
  const t = useTranslations("address-management");

  return { t };
};
