"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Slider } from "@shared/ui/slider";
import { Input } from "@shared/ui/input";
import { STORE_CURRENCY } from "@shared/config/currency";
import { usePriceRangeSlider } from "../lib/usePriceRangeSlider";
import type { PriceRangeSliderProps } from "../model/interface";

export function PriceRangeSlider(props: PriceRangeSliderProps) {
  const {
    minPrice,
    maxPrice,
    selectedMin,
    selectedMax,
    currency = STORE_CURRENCY,
  } = props;

  const {
    t,
    minInput,
    maxInput,
    isExpanded,
    toggleExpanded,
    handleSliderChange,
    handleMinInputChange,
    handleMaxInputChange,
    handleMinInputBlur,
    handleMaxInputBlur,
  } = usePriceRangeSlider(props);

  return (
    <div className="space-y-2">
      <button
        onClick={toggleExpanded}
        className="flex w-full items-center justify-between text-sm font-semibold hover:text-foreground/80 transition-colors"
      >
        <span>{t("priceRange")}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isExpanded && (
        <>
          {/* Slider */}
          <div className="px-2 py-2">
            <Slider
              min={minPrice}
              max={maxPrice}
              step={10}
              value={[selectedMin, selectedMax]}
              onValueChange={handleSliderChange}
              className="w-full"
            />
          </div>

          {/* Input fields */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs text-muted-foreground">
                {t("min")}
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={minInput}
                  onChange={handleMinInputChange}
                  onBlur={handleMinInputBlur}
                  className="h-9 pr-11 text-sm"
                  min={minPrice}
                  max={maxPrice}
                  placeholder={t("minPlaceholder")}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                  {currency}
                </span>
              </div>
            </div>
            <div className="mt-6 text-muted-foreground">—</div>
            <div className="flex-1">
              <label className="mb-1.5 block text-xs text-muted-foreground">
                {t("max")}
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={maxInput}
                  onChange={handleMaxInputChange}
                  onBlur={handleMaxInputBlur}
                  className="h-9 pr-11 text-sm"
                  min={minPrice}
                  max={maxPrice}
                  placeholder={t("maxPlaceholder")}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                  {currency}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
