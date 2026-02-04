"use client";

import { useState, useMemo, useCallback } from "react";
import { useMessages, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useUpdateSearchParams } from "@features/product-search";
import { SORT_OPTIONS } from "@features/product-sort";
import type { Aggregation } from "@entities/product";

interface UseProductFiltersProps {
  aggregations?: Aggregation[];
  sortValue?: string;
}

// Parse URL params to get selected filter values for an attribute
const parseSelectedValues = (
  searchParams: URLSearchParams,
  attributeCode: string,
): string[] => {
  const param = searchParams.get(attributeCode);
  return param ? param.split(",").filter(Boolean) : [];
};

// Parse price range from URL params
const parsePriceRange = (
  searchParams: URLSearchParams,
): { from?: number; to?: number } => {
  const priceParam = searchParams.get("price");
  if (!priceParam) return {};

  const [from, to] = priceParam.split("_").map(Number);
  return {
    from: !isNaN(from) ? from : undefined,
    to: !isNaN(to) ? to : undefined,
  };
};

export const useProductFilters = ({
  aggregations = [],
  sortValue = SORT_OPTIONS.POSITION,
}: UseProductFiltersProps) => {
  const t = useTranslations("product-filters");
  const tSort = useTranslations("product-sort");
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();

  // Dynamic filter state - track selected values for each attribute
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >(() => {
    const initial: Record<string, string[]> = {};
    aggregations.forEach((agg) => {
      if (agg.attribute_code !== "price") {
        initial[agg.attribute_code] = parseSelectedValues(
          searchParams || new URLSearchParams(),
          agg.attribute_code,
        );
      }
    });
    return initial;
  });

  // Price range state
  const [priceRange, setPriceRange] = useState<{
    min: number;
    max: number;
  }>(() => {
    const urlRange = parsePriceRange(searchParams || new URLSearchParams());
    return {
      min: urlRange.from ?? 0,
      max: urlRange.to ?? 1000,
    };
  });

  // Toggle a filter option (checkbox behavior) - auto-apply
  const handleToggleFilter = (attributeCode: string, value: string) => {
    const current = selectedFilters[attributeCode] || [];
    const isSelected = current.includes(value);

    const newSelected = {
      ...selectedFilters,
      [attributeCode]: isSelected
        ? current.filter((v) => v !== value)
        : [...current, value],
    };

    setSelectedFilters(newSelected);

    // Auto-apply filters after state update
    setTimeout(() => {
      const updates: Record<string, string | null> = {};

      // Add all dynamic filters (including price)
      aggregations.forEach((agg) => {
        const values = newSelected[agg.attribute_code] || [];
        updates[agg.attribute_code] =
          values.length > 0 ? values.join(",") : null;
      });

      updateSearchParams(updates);
    }, 0);
  };

  // Clear all selections for a specific filter group - auto-apply
  const handleClearFilterGroup = (attributeCode: string) => {
    const newSelected = {
      ...selectedFilters,
      [attributeCode]: [],
    };

    setSelectedFilters(newSelected);

    // Auto-apply filters after state update
    setTimeout(() => {
      const updates: Record<string, string | null> = {};

      // Add all dynamic filters (including price)
      aggregations.forEach((agg) => {
        const values = newSelected[agg.attribute_code] || [];
        updates[agg.attribute_code] =
          values.length > 0 ? values.join(",") : null;
      });

      updateSearchParams(updates);
    }, 0);
  };

  // Handle price range change
  const handlePriceRangeChange = useCallback(
    (min: number, max: number) => {
      setPriceRange({ min, max });

      // Auto-apply price filter (using underscore separator to match API format)
      setTimeout(() => {
        updateSearchParams({
          price: min === 0 && max === 1000 ? null : `${min}_${max}`,
        });
      }, 0);
    },
    [updateSearchParams],
  );

  // Clear all filters
  const handleClearAll = () => {
    // Clear all dynamic filters
    const clearedFilters: Record<string, string[]> = {};
    aggregations.forEach((agg) => {
      if (agg.attribute_code !== "price") {
        clearedFilters[agg.attribute_code] = [];
      }
    });
    setSelectedFilters(clearedFilters);

    // Reset price range
    setPriceRange({ min: 0, max: 1000 });

    // Clear URL params (including sort, page, and pageSize)
    const updates: Record<string, string | null> = {};
    aggregations.forEach((agg) => {
      updates[agg.attribute_code] = null;
    });
    updates.price = null;
    updates.sort = null;
    updates.page = null;
    updates.pageSize = null;
    updateSearchParams(updates);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    updateSearchParams({
      sort: value === SORT_OPTIONS.POSITION ? null : value,
    });
  };

  // Check if any filters are active (including price, sort, page, and pageSize)
  const hasActiveFilters = useMemo(() => {
    const hasAttributeFilters = Object.values(selectedFilters).some(
      (arr) => arr.length > 0,
    );
    const hasPriceFilter = priceRange.min !== 0 || priceRange.max !== 1000;
    const hasSortFilter = sortValue !== SORT_OPTIONS.POSITION;
    const hasPageFilter = searchParams?.get("page") !== null;
    const hasPageSizeFilter = searchParams?.get("pageSize") !== null;
    return (
      hasAttributeFilters ||
      hasPriceFilter ||
      hasSortFilter ||
      hasPageFilter ||
      hasPageSizeFilter
    );
  }, [selectedFilters, priceRange, sortValue, searchParams]);

  // Access raw messages for dynamic city lookups
  const messages = useMessages();
  const cityMessages =
    (messages?.["product-filters"] as Record<string, unknown>)?.cities as
      | Record<string, string>
      | undefined;

  // Known translatable filter labels
  const TRANSLATABLE_LABELS: Record<string, Parameters<typeof t>[0]> = {
    city: "labels.city",
    price: "labels.price",
  };

  // Filter out price from aggregations (we handle it separately) and apply translations
  const attributeAggregations = aggregations
    .filter((agg) => agg.attribute_code !== "price")
    .map((agg) => ({
      ...agg,
      label: TRANSLATABLE_LABELS[agg.attribute_code]
        ? t(TRANSLATABLE_LABELS[agg.attribute_code])
        : agg.label,
      options:
        agg.attribute_code === "city"
          ? agg.options.map((opt) => ({
              ...opt,
              label: cityMessages?.[opt.label] ?? opt.label,
            }))
          : agg.options,
    }));

  return {
    t,
    tSort,
    selectedFilters,
    attributeAggregations,
    hasActiveFilters,
    sortValue,
    sortOptions: SORT_OPTIONS,
    priceRange,
    handleClearAll,
    handleToggleFilter,
    handleClearFilterGroup,
    handleSortChange,
    handlePriceRangeChange,
  };
};
