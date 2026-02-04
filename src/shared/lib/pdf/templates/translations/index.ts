import { roTranslations, type ContractTranslations } from "./ro";
import { enTranslations } from "./en";
import { ruTranslations } from "./ru";

const translations: Record<string, ContractTranslations> = {
  ro: roTranslations,
  en: enTranslations,
  ru: ruTranslations,
};

export const SUPPORTED_CONTRACT_LANGUAGES = ["ro", "en", "ru"] as const;
export type ContractLanguage = (typeof SUPPORTED_CONTRACT_LANGUAGES)[number];

export function getContractTranslations(
  locale: string
): ContractTranslations {
  // Default to Romanian if translation not available
  return translations[locale] || translations.ro;
}

export type { ContractTranslations };
