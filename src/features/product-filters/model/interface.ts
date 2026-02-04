import type { Aggregation } from "@entities/product";

export interface ProductFiltersClientProps {
  aggregations?: Aggregation[];
  sortValue?: string;
}

export interface FiltersContentProps {
  aggregations?: Aggregation[];
  sortValue?: string;
}

export interface MultiSelectDropdownProps {
  label: string;
  options: { label: string; value: string; count: number }[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
  defaultExpanded?: boolean;
}

export interface PriceRangeSliderProps {
  minPrice: number;
  maxPrice: number;
  selectedMin: number;
  selectedMax: number;
  onRangeChange: (min: number, max: number) => void;
  currency?: string;
}

export interface SizeFilterListProps {
  label: string;
  options: { label: string; value: string; count: number }[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}

export interface ColorFilterGridProps {
  label: string;
  options: { label: string; value: string; count: number }[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}
