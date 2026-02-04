"use client";

import { useTranslations } from "next-intl";
import { useUpdateSearchParams } from "@features/product-search";
import { SORT_OPTIONS, type SortOption } from "../model/sortOptions";

interface UseProductSortProps {
  defaultValue?: SortOption;
}

export const useProductSort = ({
  defaultValue = SORT_OPTIONS.POSITION,
}: UseProductSortProps) => {
  const t = useTranslations("product-sort");
  const updateSearchParams = useUpdateSearchParams();

  const handleSortChange = (value: string) => {
    updateSearchParams({
      sort: value === SORT_OPTIONS.POSITION ? null : value,
    });
  };

  return {
    t,
    defaultValue,
    handleSortChange,
    SORT_OPTIONS,
  };
};
