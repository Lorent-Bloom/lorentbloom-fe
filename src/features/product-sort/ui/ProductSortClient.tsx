"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { useProductSort } from "../lib/useProductSort";
import type { ProductSortClientProps } from "../model/interface";

export function ProductSortClient(props: ProductSortClientProps) {
  const { t, defaultValue, handleSortChange, SORT_OPTIONS } =
    useProductSort(props);

  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-3 font-semibold">{t("sortBy")}</h2>
      <div className="space-y-2">
        <Select value={defaultValue} onValueChange={handleSortChange}>
          <SelectTrigger id="sort" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SORT_OPTIONS.POSITION}>
              {t("position")}
            </SelectItem>
            <SelectItem value={SORT_OPTIONS.NAME_ASC}>
              {t("nameAsc")}
            </SelectItem>
            <SelectItem value={SORT_OPTIONS.NAME_DESC}>
              {t("nameDesc")}
            </SelectItem>
            <SelectItem value={SORT_OPTIONS.PRICE_ASC}>
              {t("priceAsc")}
            </SelectItem>
            <SelectItem value={SORT_OPTIONS.PRICE_DESC}>
              {t("priceDesc")}
            </SelectItem>
            <SelectItem value={SORT_OPTIONS.NEWEST}>{t("newest")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
