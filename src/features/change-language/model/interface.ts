import type { Locale } from "@shared/config/i18n";

export interface LanguageSelectorProps {
  className?: string;
}

export interface LocaleOption {
  key: string;
  value: Locale;
  label: string;
  flag: string;
}

export interface LanguageSelectorClientProps {
  localeOptions: LocaleOption[];
  className?: string;
}
