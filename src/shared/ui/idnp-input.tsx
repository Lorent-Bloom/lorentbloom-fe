"use client";

import { forwardRef } from "react";
import { IMaskInput } from "react-imask";
import { cn } from "@shared/lib/utils";

export interface IdnpInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  onChange?: (value: string) => void;
}

/**
 * Moldovan IDNP Input with mask (13 digits starting with 2)
 * Format: 2TTTXXXYYYYYK
 * - 2: Identifier for natural persons
 * - TTT: Last 3 digits of year IDNP was assigned
 * - XXX: Civil status code
 * - YYYYY: Sequential registration number
 * - K: Check digit
 */
const IdnpInput = forwardRef<HTMLInputElement, IdnpInputProps>(
  ({ className, onChange, value, ...props }, ref) => {
    return (
      <IMaskInput
        mask="2000000000000"
        definitions={{
          "0": /[0-9]/,
        }}
        unmask={false}
        value={String(value || "")}
        onAccept={(value: string) => onChange?.(value)}
        inputRef={ref}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        placeholder="2XXXXXXXXXXXX"
        {...props}
      />
    );
  },
);

IdnpInput.displayName = "IdnpInput";

export { IdnpInput };
