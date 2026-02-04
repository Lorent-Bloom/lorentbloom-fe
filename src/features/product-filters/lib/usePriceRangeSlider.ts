"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { PriceRangeSliderProps } from "../model/interface";

export const usePriceRangeSlider = ({
  minPrice,
  maxPrice,
  selectedMin,
  selectedMax,
  onRangeChange,
}: PriceRangeSliderProps) => {
  const t = useTranslations("product-filters");
  // Local state for input fields (allows typing without immediate updates)
  const [minInput, setMinInput] = useState(selectedMin.toString());
  const [maxInput, setMaxInput] = useState(selectedMax.toString());
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // Sync local state when props change
  useEffect(() => {
    setMinInput(selectedMin.toString());
  }, [selectedMin]);

  useEffect(() => {
    setMaxInput(selectedMax.toString());
  }, [selectedMax]);

  // Handle slider change
  const handleSliderChange = useCallback(
    (value: number[]) => {
      const [newMin, newMax] = value;
      onRangeChange(newMin, newMax);
    },
    [onRangeChange],
  );

  // Handle min input change
  const handleMinInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setMinInput(value);
    },
    [],
  );

  // Handle max input change
  const handleMaxInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setMaxInput(value);
    },
    [],
  );

  // Handle min input blur (apply the value)
  const handleMinInputBlur = useCallback(() => {
    const numValue = parseFloat(minInput);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(minPrice, Math.min(numValue, selectedMax));
      onRangeChange(clampedValue, selectedMax);
    } else {
      setMinInput(selectedMin.toString());
    }
  }, [minInput, minPrice, selectedMax, selectedMin, onRangeChange]);

  // Handle max input blur (apply the value)
  const handleMaxInputBlur = useCallback(() => {
    const numValue = parseFloat(maxInput);
    if (!isNaN(numValue)) {
      const clampedValue = Math.min(maxPrice, Math.max(numValue, selectedMin));
      onRangeChange(selectedMin, clampedValue);
    } else {
      setMaxInput(selectedMax.toString());
    }
  }, [maxInput, maxPrice, selectedMin, selectedMax, onRangeChange]);

  return {
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
  };
};
