import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE_NAME } from "../model/const";

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localeCookie: {
    name: LOCALE_COOKIE_NAME,
  },
});
