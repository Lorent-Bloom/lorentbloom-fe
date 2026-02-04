"use client";

import { useState, useMemo } from "react";
import type { DateRange } from "react-day-picker";
import { useAddToCart } from "./useAddToCart";
import type { ConfigurableProductOption } from "@entities/product";

export const useAddToCartModal = (
  productId: number,
  productSku: string,
  _initialQuantity?: number,
  configurableOptions?: ConfigurableProductOption[],
  onSuccess?: () => void,
) => {
  const { handleAddToCart, isPending } = useAddToCart(productId, productSku);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  const hasRequiredOptions =
    !!configurableOptions && configurableOptions.length > 0;

  const allOptionsSelected = useMemo(() => {
    if (!hasRequiredOptions) return true;
    return configurableOptions.every((option) => !!selectedOptions[option.uid]);
  }, [hasRequiredOptions, configurableOptions, selectedOptions]);

  const handleOptionChange = (optionUid: string, valueUid: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionUid]: valueUid,
    }));
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dateRange?.from || !dateRange?.to) {
      return;
    }

    if (hasRequiredOptions && !allOptionsSelected) {
      return;
    }

    // Convert selected options to array of option UIDs
    const selectedOptionsArray = hasRequiredOptions
      ? Object.values(selectedOptions)
      : undefined;

    await handleAddToCart(
      {
        quantity: 1,
        startDate: dateRange.from,
        endDate: dateRange.to,
        selectedOptions: selectedOptionsArray,
      },
      onSuccess,
    );
  };

  return {
    dateRange,
    isPending,
    selectedOptions,
    hasRequiredOptions,
    allOptionsSelected,
    handleDateRangeChange,
    handleOptionChange,
    handleSubmit,
  };
};
