import LanguageSelectorClient from "./LanguageSelectorClient";
import {
  LOCALES,
  LOCALES_FULL_NAME,
  LOCALES_FLAG,
  type Locale,
} from "@shared/config/i18n";
import type { LanguageSelectorProps } from "../model/interface";
import { FC } from "react";

const LanguageSelector: FC<LanguageSelectorProps> = ({ className }) => {
  const localeOptions = LOCALES.map((locale) => ({
    key: locale,
    value: locale as Locale,
    label: LOCALES_FULL_NAME[locale],
    flag: LOCALES_FLAG[locale],
  }));

  return (
    <LanguageSelectorClient
      localeOptions={localeOptions}
      className={className}
    />
  );
};

export default LanguageSelector;
