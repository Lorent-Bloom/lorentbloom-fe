"use client";

import { useState, useCallback } from "react";
import type { SizeFilterListProps } from "../model/interface";

export const useSizeFilterList = ({
  selectedValues,
  onToggle,
}: SizeFilterListProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggle = useCallback(
    (value: string) => {
      onToggle(value);
    },
    [onToggle],
  );

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const isSelected = useCallback(
    (value: string) => selectedValues.includes(value),
    [selectedValues],
  );

  return {
    isExpanded,
    toggleExpanded,
    handleToggle,
    isSelected,
  };
};
