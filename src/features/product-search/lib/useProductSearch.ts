"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useDebounce } from "./useDebounce";
import { useUpdateSearchParams } from "./useSearchParams";

interface UseProductSearchProps {
  defaultValue?: string;
}

export const useProductSearch = ({
  defaultValue = "",
}: UseProductSearchProps) => {
  const t = useTranslations("product-search");
  const [search, setSearch] = useState(defaultValue);
  const debouncedSearch = useDebounce(search, 500);
  const updateSearchParams = useUpdateSearchParams();

  useEffect(() => {
    updateSearchParams({ search: debouncedSearch || null });
  }, [debouncedSearch, updateSearchParams]);

  const handleClear = () => {
    setSearch("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return {
    t,
    search,
    handleClear,
    handleSearchChange,
  };
};
