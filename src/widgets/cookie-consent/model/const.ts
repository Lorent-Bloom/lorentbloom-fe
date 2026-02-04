import type { ConsentState, ConsentCategoryConfig } from "./interface";

export const COOKIE_CONSENT_KEY = "cookie-consent";

export const ESSENTIAL_CATEGORIES: ConsentCategoryConfig[] = [
  {
    key: "functionality_storage",
    isEssential: true,
    translationKey: "categories.functionality",
  },
  {
    key: "security_storage",
    isEssential: true,
    translationKey: "categories.security",
  },
];

export const OPTIONAL_CATEGORIES: ConsentCategoryConfig[] = [
  {
    key: "analytics_storage",
    isEssential: false,
    translationKey: "categories.analytics",
  },
  {
    key: "ad_storage",
    isEssential: false,
    translationKey: "categories.ads",
  },
  {
    key: "ad_user_data",
    isEssential: false,
    translationKey: "categories.adUserData",
  },
  {
    key: "ad_personalization",
    isEssential: false,
    translationKey: "categories.adPersonalization",
  },
  {
    key: "personalization_storage",
    isEssential: false,
    translationKey: "categories.personalization",
  },
];

export const ALL_CATEGORIES: ConsentCategoryConfig[] = [
  ...ESSENTIAL_CATEGORIES,
  ...OPTIONAL_CATEGORIES,
];

export const DEFAULT_CONSENT_STATE: ConsentState = {
  functionality_storage: "granted",
  security_storage: "granted",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
  personalization_storage: "denied",
};

export const ALL_GRANTED_STATE: ConsentState = {
  functionality_storage: "granted",
  security_storage: "granted",
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
  personalization_storage: "granted",
};
