"use client";

import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@shared/lib/utils/helpers";
import { useColorFilterGrid } from "../lib/useColorFilterGrid";
import { getColorValue, isLightColor } from "../lib/colorMapping";
import type { ColorFilterGridProps } from "../model/interface";

export function ColorFilterGrid(props: ColorFilterGridProps) {
  const { label, options } = props;
  const { isExpanded, toggleExpanded, handleToggle, isSelected } =
    useColorFilterGrid(props);

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

      {/* Collapsible content - Grid of colored circles (5 per row) */}
      {isExpanded && (
        <div className="grid grid-cols-5 gap-1">
          {options.map((option) => {
            const selected = isSelected(option.value);
            const colorValue = getColorValue(option.label);
            const needsBorder = isLightColor(option.label);

            return (
              <button
                key={option.value}
                onClick={() => handleToggle(option.value)}
                className="group relative flex flex-col items-center"
                title={`${option.label} (${option.count})`}
              >
                {/* Color circle */}
                <div
                  className={cn(
                    "h-7 w-7 rounded-full transition-all cursor-pointer",
                    selected
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : "hover:ring-2 hover:ring-muted-foreground/30 hover:ring-offset-1",
                    needsBorder && "border border-border",
                  )}
                  style={{
                    background: colorValue,
                  }}
                >
                  {/* Checkmark for selected */}
                  {selected && (
                    <div className="flex h-full w-full items-center justify-center">
                      <Check
                        className={cn(
                          "h-3 w-3",
                          needsBorder ? "text-foreground" : "text-white",
                        )}
                        strokeWidth={3}
                      />
                    </div>
                  )}
                </div>

                {/* Color name - shown on hover or when selected */}
                <span
                  className={cn(
                    "text-[10px] text-center leading-tight max-w-full truncate transition-opacity",
                    selected
                      ? "opacity-100 text-foreground font-medium"
                      : "opacity-0 group-hover:opacity-100 text-muted-foreground",
                  )}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
