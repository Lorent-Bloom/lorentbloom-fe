/**
 * Category search utilities
 * Client-side filtering and search functions for category tree
 */

import type { Category } from "../api/model/entity";

export interface CategorySearchResult {
  category: Category;
  breadcrumb: string[]; // e.g., ["Women", "Tops", "T-Shirts"]
  matchPosition: number; // Position where match was found (for relevance sorting)
}

/**
 * Flattens a hierarchical category tree into a flat array with parent information
 */
function flattenCategoryTree(
  categories: Category[],
  parentBreadcrumb: string[] = [],
): Array<{ category: Category; breadcrumb: string[] }> {
  const result: Array<{ category: Category; breadcrumb: string[] }> = [];

  for (const category of categories) {
    const breadcrumb = [...parentBreadcrumb, category.name];
    result.push({ category, breadcrumb });

    if (category.children && category.children.length > 0) {
      result.push(...flattenCategoryTree(category.children, breadcrumb));
    }
  }

  return result;
}

/**
 * Searches categories by name (case-insensitive substring match)
 * Returns top matches sorted by relevance
 *
 * @param categories - Category tree to search
 * @param query - Search query string
 * @param maxResults - Maximum number of results to return (default: 8)
 * @returns Array of matching categories with breadcrumb trails
 */
export function searchCategories(
  categories: Category[],
  query: string,
  maxResults: number = 8,
): CategorySearchResult[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const flatCategories = flattenCategoryTree(categories);

  // Filter matches and calculate match position for relevance
  const matches: CategorySearchResult[] = flatCategories
    .map(({ category, breadcrumb }) => {
      const normalizedName = category.name.toLowerCase();
      const matchPosition = normalizedName.indexOf(normalizedQuery);

      if (matchPosition !== -1) {
        return {
          category,
          breadcrumb,
          matchPosition,
        };
      }

      return null;
    })
    .filter((match): match is CategorySearchResult => match !== null);

  // Sort by relevance:
  // 1. Exact matches first (matchPosition === 0)
  // 2. Earlier matches (lower matchPosition)
  // 3. Shorter names (more specific)
  // 4. Higher level categories (lower level number)
  matches.sort((a, b) => {
    // Prioritize matches at the beginning of the name
    if (a.matchPosition !== b.matchPosition) {
      return a.matchPosition - b.matchPosition;
    }

    // Then prioritize shorter names (more specific matches)
    const lengthDiff = a.category.name.length - b.category.name.length;
    if (lengthDiff !== 0) {
      return lengthDiff;
    }

    // Finally, prioritize higher-level categories
    return a.category.level - b.category.level;
  });

  // Return top N results
  return matches.slice(0, maxResults);
}

/**
 * Gets the breadcrumb trail for a specific category
 * Searches the tree recursively to build the full path
 *
 * @param category - Category to find breadcrumb for
 * @param tree - Full category tree
 * @returns Breadcrumb trail as array of category names
 */
export function getCategoryBreadcrumb(
  category: Category,
  tree: Category[],
): string[] {
  // Helper function to recursively search for category and build breadcrumb
  function findInTree(
    categories: Category[],
    targetUid: string,
    currentPath: string[] = [],
  ): string[] | null {
    for (const cat of categories) {
      const newPath = [...currentPath, cat.name];

      if (cat.uid === targetUid) {
        return newPath;
      }

      if (cat.children && cat.children.length > 0) {
        const result = findInTree(cat.children, targetUid, newPath);
        if (result) {
          return result;
        }
      }
    }

    return null;
  }

  const breadcrumb = findInTree(tree, category.uid);
  return breadcrumb || [category.name]; // Fallback to just category name if not found
}
