import { useMemo, useState, useCallback } from "react";
import type { MultiSelectDropdownProps } from "../model/interface";

export const useMultiSelectDropdown = (props: MultiSelectDropdownProps) => {
  const { label, options, selectedValues, onToggle, onClear, defaultExpanded = false } = props;
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const isSelected = useCallback(
    (value: string) => selectedValues.includes(value),
    [selectedValues],
  );

  const handleToggle = (value: string) => {
    onToggle(value);
  };

  const handleClear = () => {
    onClear();
  };

  const hasSelections = selectedValues.length > 0;

  // Generate display text for the trigger button
  const displayText = useMemo(() => {
    if (selectedValues.length === 0) {
      return `Select ${label.toLowerCase()}...`;
    }
    if (selectedValues.length === 1) {
      const option = options.find((opt) => opt.value === selectedValues[0]);
      return option?.label || selectedValues[0];
    }
    return `${selectedValues.length} selected`;
  }, [selectedValues, options, label]);

  return {
    label,
    options,
    selectedValues,
    isExpanded,
    toggleExpanded,
    isSelected,
    handleToggle,
    handleClear,
    hasSelections,
    displayText,
  };
};
