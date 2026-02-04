export type ConsentCategory =
  | "functionality_storage"
  | "security_storage"
  | "ad_storage"
  | "ad_user_data"
  | "ad_personalization"
  | "analytics_storage"
  | "personalization_storage";

export type ConsentValue = "granted" | "denied";

export type ConsentState = Record<ConsentCategory, ConsentValue>;

export interface ConsentCategoryConfig {
  key: ConsentCategory;
  isEssential: boolean;
  translationKey: string;
}

export interface CookiePreferencesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: ConsentState;
  onToggle: (category: ConsentCategory) => void;
  onSave: () => void;
  categories: ConsentCategoryConfig[];
}
