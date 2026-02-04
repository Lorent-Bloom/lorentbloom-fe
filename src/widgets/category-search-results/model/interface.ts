/**
 * Category Search Results Widget - Type Definitions
 */

import type { Category } from "@entities/category";

export interface CategorySearchResultsProps {
  categories: Category[];
  searchQuery: string;
  locale: string;
  className?: string;
}

export interface CategoryCardProps {
  category: Category;
  breadcrumb: string[];
  locale: string;
  onClick: () => void;
}
