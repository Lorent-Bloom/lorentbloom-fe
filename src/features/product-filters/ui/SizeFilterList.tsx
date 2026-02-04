"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@shared/ui/checkbox";
import { cn } from "@shared/lib/utils/helpers";
import { useSizeFilterList } from "../lib/useSizeFilterList";
import type { SizeFilterListProps } from "../model/interface";

export function SizeFilterList(props: SizeFilterListProps) {
  const { label, options } = props;
  const { isExpanded, toggleExpanded, handleToggle, isSelected } =
    useSizeFilterList(props);

  return (
    <div className="space-y-2">
      {/* Header with expand/collapse button */}
      <button
        onClick={toggleExpanded}
        className="flex w-full items-center justify-between text-sm font-semibold hover:text-foreground/80 transition-colors"
      >
        <span>{label}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {/* Collapsible content */}
      {isExpanded && (
        <div className="max-h-48 overflow-y-auto pr-1 space-y-0.5 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          {options.map((option) => {
            const selected = isSelected(option.value);
            return (
              <div
                key={option.value}
                className={cn(
                  "flex items-center gap-2 rounded-sm px-1.5 py-1 cursor-pointer hover:bg-accent transition-colors",
                  selected && "bg-accent/50",
                )}
                onClick={() => handleToggle(option.value)}
              >
                <Checkbox
                  checked={selected}
                  onCheckedChange={() => handleToggle(option.value)}
                  className="pointer-events-none h-4 w-4"
                />
                <span className="flex-1 text-sm select-none">
                  {option.label}{" "}
                  <span className="text-xs text-muted-foreground">
                    ({option.count})
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
