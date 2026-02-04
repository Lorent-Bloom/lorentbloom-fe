"use client";

import { Search, X } from "lucide-react";
import { Input } from "@shared/ui/input";
import { Button } from "@shared/ui/button";
import { useProductSearch } from "../lib/useProductSearch";
import type { ProductSearchClientProps } from "../model/interface";

export function ProductSearchClient(props: ProductSearchClientProps) {
  const { t, search, handleClear, handleSearchChange } =
    useProductSearch(props);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={t("placeholder")}
        value={search}
        onChange={handleSearchChange}
        className="pl-9 pr-9"
      />
      {search && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          aria-label={t("clear")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
