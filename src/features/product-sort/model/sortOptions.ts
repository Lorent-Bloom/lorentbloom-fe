export const SORT_OPTIONS = {
  POSITION: "position",
  NAME_ASC: "name_asc",
  NAME_DESC: "name_desc",
  PRICE_ASC: "price_asc",
  PRICE_DESC: "price_desc",
  NEWEST: "newest",
} as const;

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];

export function parseSortOption(value: string): SortOption {
  if (Object.values(SORT_OPTIONS).includes(value as SortOption)) {
    return value as SortOption;
  }
  return SORT_OPTIONS.POSITION;
}

export function getSortVariables(sortOption: SortOption) {
  switch (sortOption) {
    case SORT_OPTIONS.NAME_ASC:
      return { name: "ASC" as const };
    case SORT_OPTIONS.NAME_DESC:
      return { name: "DESC" as const };
    case SORT_OPTIONS.PRICE_ASC:
      return { price: "ASC" as const };
    case SORT_OPTIONS.PRICE_DESC:
      return { price: "DESC" as const };
    case SORT_OPTIONS.NEWEST:
      // Adobe Commerce may not support created_at sorting in all installations
      // Using reverse position as fallback for "newest" items
      return { position: "DESC" as const };
    case SORT_OPTIONS.POSITION:
    default:
      return { position: "ASC" as const };
  }
}
