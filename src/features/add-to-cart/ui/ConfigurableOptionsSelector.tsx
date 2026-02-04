"use client";

import { useTranslations } from "next-intl";
import { Label } from "@shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { useConfigurableOptionsSelector } from "../lib/useConfigurableOptionsSelector";
import type { ConfigurableOptionsSelectorProps } from "../model/interface";

export default function ConfigurableOptionsSelector({
  options,
  selectedOptions,
  onOptionChange,
}: ConfigurableOptionsSelectorProps) {
  const { handleSelectChange } = useConfigurableOptionsSelector(onOptionChange);
  const t = useTranslations("add-to-cart");

  if (!options || options.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {options.map((option) => (
        <div key={option.uid} className="space-y-2">
          <Label htmlFor={option.attribute_code}>{option.label}</Label>
          <Select
            value={selectedOptions[option.uid] || ""}
            onValueChange={(value) => handleSelectChange(option.uid, value)}
          >
            <SelectTrigger id={option.attribute_code} className="w-full">
              <SelectValue
                placeholder={t("selectOption", { option: option.label })}
              />
            </SelectTrigger>
            <SelectContent>
              {option.values.map((value) => (
                <SelectItem key={value.uid} value={value.uid}>
                  {value.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
