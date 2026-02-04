/**
 * Category Search Results Widget - Logic Hook
 */

"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { searchCategories, type Category } from "@entities/category";

interface UseCategorySearchResultsProps {
  categories: Category[];
  searchQuery: string;
  locale: string;
}

export function useCategorySearchResults({
  categories,
  searchQuery,
  locale,
}: UseCategorySearchResultsProps) {
  const router = useRouter();
  const t = useTranslations("category-search-results");

  // Filter categories based on search query (client-side)
  const filteredCategories = searchCategories(categories, searchQuery, 8);

  // Handle category click - navigate to category page
  const handleCategoryClick = (category: Category) => {
    if (category.url_path) {
      router.push(`/${locale}/products/${category.url_path}`);
    }
  };

  return {
    filteredCategories,
    handleCategoryClick,
    t,
  };
}
