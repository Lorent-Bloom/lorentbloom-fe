import { Star } from "lucide-react";
import * as React from "react";

import { cn } from "@shared/lib/utils";

interface StarRatingProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  reviewCount?: number;
}

const sizeClasses = {
  sm: "size-3",
  md: "size-4",
  lg: "size-5",
};

const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  (
    {
      rating,
      maxRating = 5,
      size = "md",
      showValue = false,
      reviewCount,
      className,
      ...props
    },
    ref,
  ) => {
    const normalizedRating = Math.max(0, Math.min(rating, maxRating));
    const percentage = (normalizedRating / maxRating) * 100;

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        <div className="relative flex items-center">
          {/* Background (empty) stars */}
          <div className="flex">
            {Array.from({ length: maxRating }, (_, i) => (
              <Star
                key={`empty-${i}`}
                className={cn(sizeClasses[size], "text-muted-foreground/30")}
                fill="currentColor"
              />
            ))}
          </div>

          {/* Foreground (filled) stars - overlaid with clipping */}
          <div
            className="absolute left-0 top-0 flex overflow-hidden"
            style={{ width: `${percentage}%` }}
          >
            {Array.from({ length: maxRating }, (_, i) => (
              <Star
                key={`filled-${i}`}
                className={cn(sizeClasses[size], "text-yellow-500")}
                fill="currentColor"
              />
            ))}
          </div>
        </div>

        {(showValue || reviewCount !== undefined) && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {showValue && <span>{normalizedRating.toFixed(1)}</span>}
            {reviewCount !== undefined && (
              <span className="text-xs">({reviewCount})</span>
            )}
          </div>
        )}
      </div>
    );
  },
);

StarRating.displayName = "StarRating";

export { StarRating };
