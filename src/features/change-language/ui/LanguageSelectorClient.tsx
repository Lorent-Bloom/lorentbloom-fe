"use client";

import { Globe, Check } from "lucide-react";
import { Button } from "@shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { useLanguageSelectorClient } from "../lib/useLanguageSelectorClient";
import type { LanguageSelectorClientProps } from "../model/interface";
import { FC } from "react";
import { cn } from "@shared/lib/utils";

const LanguageSelectorClient: FC<LanguageSelectorClientProps> = ({
  localeOptions,
  className,
}) => {
  const { currentLocale, setLocale } = useLanguageSelectorClient();

  const currentOption = localeOptions.find(
    (option) => option.value === currentLocale,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "gap-1.5 px-2 sm:px-3 min-h-11 sm:min-h-0 focus-visible:ring-offset-0",
            className,
          )}
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">{currentOption?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {localeOptions.map((option) => {
          const isSelected = option.value === currentLocale;
          return (
            <DropdownMenuItem
              key={option.key}
              onClick={() => setLocale(option.value)}
              className={cn(
                "cursor-pointer gap-3 py-2",
                isSelected && "bg-accent",
              )}
            >
              <span className="text-base">{option.flag}</span>
              <span className="flex-1">{option.label}</span>
              {isSelected && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelectorClient;
