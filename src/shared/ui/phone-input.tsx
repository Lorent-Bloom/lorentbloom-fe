"use client";

import { forwardRef } from "react";
import { IMaskInput } from "react-imask";
import { cn } from "@shared/lib/utils";

export interface PhoneInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  onChange?: (value: string) => void;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, onChange, value, ...props }, ref) => {
    return (
      <IMaskInput
        mask="+373 00 000 000"
        unmask={false}
        value={String(value || "")}
        onAccept={(value: string) => onChange?.(value)}
        inputRef={ref}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        placeholder="+373 XX XXX XXX"
        {...props}
      />
    );
  },
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
