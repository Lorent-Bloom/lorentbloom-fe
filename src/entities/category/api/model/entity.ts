/**
 * Category entity types for Magento GraphQL API
 */

export interface Category {
  id: number;
  uid: string;
  level: number;
  name: string;
  path: string;
  url_path: string;
  url_key: string;
  image: string | null;
  description: string | null;
  children_count: number;
  product_count: number;
  children?: Category[];
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}

export interface CategoryFilterInput {
  ids?: {
    eq?: string;
    in?: string[];
  };
  parent_id?: {
    eq?: string;
    in?: string[];
  };
  name?: {
    match?: string;
  };
  url_key?: {
    eq?: string;
  };
}

export interface CategorySearchResult {
  category: Category;
  breadcrumb: string[]; // e.g., ["Women", "Tops", "T-Shirts"]
  matchPosition: number; // Position where match was found (for relevance sorting)
}
