import type { Locale } from "../model/type";

export const DEFAULT_LOCALE = "en"; // NOTE: if you change this, also change import in types

export const LOCALES = ["en", "ru", "ro"];

export const LOCALES_MAPPING: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
  ro: "RO",
};

export const LOCALES_FULL_NAME: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  ro: "Română",
};

export const LOCALES_FLAG: Record<Locale, string> = {
  en: "🇬🇧",
  ru: "🇷🇺",
  ro: "🇷🇴",
};

export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";
