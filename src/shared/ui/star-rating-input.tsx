"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@shared/lib/utils";

export interface StarRatingInputProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

export function StarRatingInput({
  value,
  onChange,
  max = 5,
  size = "md",
  disabled = false,
  className,
}: StarRatingInputProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const handleClick = (rating: number) => {
    if (!disabled && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!disabled) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverValue(null);
    }
  };

  const displayValue = hoverValue ?? value;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: max }, (_, index) => {
        const rating = index + 1;
        const isFilled = rating <= displayValue;

        return (
          <button
            key={rating}
            type="button"
            onClick={() => handleClick(rating)}
            onMouseEnter={() => handleMouseEnter(rating)}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
            className={cn(
              "transition-all",
              !disabled && "cursor-pointer hover:scale-110",
              disabled && "cursor-not-allowed opacity-50",
            )}
            aria-label={`Rate ${rating} out of ${max}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "transition-all",
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-transparent text-muted-foreground",
              )}
            />
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm text-muted-foreground">
          {value} / {max}
        </span>
      )}
    </div>
  );
}
