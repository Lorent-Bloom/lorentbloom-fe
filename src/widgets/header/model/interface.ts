import type { Category } from "@entities/category";

export interface MobileMenuProps {
  locale: string;
  isAuthenticated: boolean;
  categories: Category[];
}

export interface CategoryNavBarProps {
  categories: Category[];
  locale: string;
  isAuthenticated?: boolean;
  mobileInline?: boolean;
}

// Legacy type alias for backwards compatibility
export type MobileNavProps = MobileMenuProps;
