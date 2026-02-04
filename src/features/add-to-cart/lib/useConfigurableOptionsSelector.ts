"use client";

export const useConfigurableOptionsSelector = (
  onOptionChange: (optionUid: string, valueUid: string) => void,
) => {
  const handleSelectChange = (optionUid: string, valueUid: string) => {
    onOptionChange(optionUid, valueUid);
  };

  return {
    handleSelectChange,
  };
};
