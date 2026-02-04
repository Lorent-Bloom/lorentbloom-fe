"use client";

import { useTranslations } from "next-intl";
import { Filter, X } from "lucide-react";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@shared/ui/sheet";
import { Separator } from "@shared/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { STORE_CURRENCY } from "@shared/config/currency";
import { useProductFilters } from "../lib/useProductFilters";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import { PriceRangeSlider } from "./PriceRangeSlider";
import { SizeFilterList } from "./SizeFilterList";
import { ColorFilterGrid } from "./ColorFilterGrid";
import type {
  ProductFiltersClientProps,
  FiltersContentProps,
} from "../model/interface";

function FiltersContent(props: FiltersContentProps) {
  const {
    t,
    tSort,
    selectedFilters,
    attributeAggregations,
    hasActiveFilters,
    sortValue,
    sortOptions,
    priceRange,
    handleClearAll,
    handleToggleFilter,
    handleClearFilterGroup,
    handleSortChange,
    handlePriceRangeChange,
  } = useProductFilters(props);

  return (
    <div className="space-y-4">
      {/* Header with Clear All */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{t("filtersAndSort")}</h2>
        {hasActiveFilters && (
          <Button onClick={handleClearAll} variant="outline" size="sm">
            {t("clearAll")}
          </Button>
        )}
      </div>

      {/* Active Filters Section */}
      {hasActiveFilters && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {attributeAggregations.map((aggregation) => {
              const selectedValues =
                selectedFilters[aggregation.attribute_code] || [];
              if (selectedValues.length === 0) return null;

              return selectedValues.map((value) => {
                // Find the option label for this value
                const option = aggregation.options.find(
                  (opt) => opt.value === value,
                );
                const displayLabel = option?.label || value;

                return (
                  <Badge
                    key={`${aggregation.attribute_code}-${value}`}
                    variant="secondary"
                    className="gap-1.5 pl-2.5 pr-2 py-1.5 h-auto"
                  >
                    <span className="text-xs font-medium">
                      {aggregation.label}:
                    </span>
                    <span className="text-xs">{displayLabel}</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleFilter(aggregation.attribute_code, value)
                      }
                      className="ml-0.5 hover:bg-background/80 rounded-sm p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              });
            })}
          </div>
          <Separator />
        </div>
      )}

      {/* Price Range Slider - Always visible */}
      <PriceRangeSlider
        minPrice={0}
        maxPrice={1000}
        selectedMin={priceRange.min}
        selectedMax={priceRange.max}
        onRangeChange={handlePriceRangeChange}
        currency={STORE_CURRENCY}
      />

      {/* City Filter - Always after price */}
      {attributeAggregations
        .filter((agg) => agg.attribute_code === "city")
        .map((aggregation) => (
          <MultiSelectDropdown
            key={aggregation.attribute_code}
            label={aggregation.label}
            options={aggregation.options}
            selectedValues={selectedFilters[aggregation.attribute_code] || []}
            onToggle={(value) =>
              handleToggleFilter(aggregation.attribute_code, value)
            }
            onClear={() => handleClearFilterGroup(aggregation.attribute_code)}
            defaultExpanded
          />
        ))}

      {/* Size Filter - After city */}
      {attributeAggregations
        .filter((agg) => agg.attribute_code === "size")
        .map((aggregation) => (
          <SizeFilterList
            key={aggregation.attribute_code}
            label={aggregation.label}
            options={aggregation.options}
            selectedValues={selectedFilters[aggregation.attribute_code] || []}
            onToggle={(value) =>
              handleToggleFilter(aggregation.attribute_code, value)
            }
          />
        ))}

      {/* Color Filter - Always third after size */}
      {attributeAggregations
        .filter((agg) => agg.attribute_code === "color")
        .map((aggregation) => (
          <ColorFilterGrid
            key={aggregation.attribute_code}
            label={aggregation.label}
            options={aggregation.options}
            selectedValues={selectedFilters[aggregation.attribute_code] || []}
            onToggle={(value) =>
              handleToggleFilter(aggregation.attribute_code, value)
            }
          />
        ))}

      {/* Dynamic attribute filters - Multiselect Dropdowns (excluding city, size, color, and category_uid) */}
      {attributeAggregations
        .filter(
          (agg) =>
            agg.attribute_code !== "city" &&
            agg.attribute_code !== "size" &&
            agg.attribute_code !== "color" &&
            agg.attribute_code !== "category_uid" &&
            agg.attribute_code !== "category_id",
        )
        .map((aggregation) => (
          <MultiSelectDropdown
            key={aggregation.attribute_code}
            label={aggregation.label}
            options={aggregation.options}
            selectedValues={selectedFilters[aggregation.attribute_code] || []}
            onToggle={(value) =>
              handleToggleFilter(aggregation.attribute_code, value)
            }
            onClear={() => handleClearFilterGroup(aggregation.attribute_code)}
          />
        ))}

      <Separator />

      {/* Sort Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">{tSort("sortBy")}</h3>
        <Select value={sortValue} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={sortOptions.POSITION}>
              {tSort("position")}
            </SelectItem>
            <SelectItem value={sortOptions.NAME_ASC}>
              {tSort("nameAsc")}
            </SelectItem>
            <SelectItem value={sortOptions.NAME_DESC}>
              {tSort("nameDesc")}
            </SelectItem>
            <SelectItem value={sortOptions.PRICE_ASC}>
              {tSort("priceAsc")}
            </SelectItem>
            <SelectItem value={sortOptions.PRICE_DESC}>
              {tSort("priceDesc")}
            </SelectItem>
            <SelectItem value={sortOptions.NEWEST}>
              {tSort("newest")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function ProductFiltersClient(props: ProductFiltersClientProps) {
  const t = useTranslations("product-filters");

  return (
    <>
      {/* Desktop filters - no border/title, wrapped by parent */}
      <div className="hidden lg:block">
        <FiltersContent {...props} />
      </div>

      {/* Mobile filters */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="w-full lg:hidden">
            <Filter className="mr-2 h-4 w-4" />
            {t("filtersAndSort")}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0 w-full sm:w-3/4">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>{t("filtersAndSort")}</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <FiltersContent {...props} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
