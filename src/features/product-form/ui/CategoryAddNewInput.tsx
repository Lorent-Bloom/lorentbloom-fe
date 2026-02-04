import { Check, X } from "lucide-react";
import { cn } from "@shared/lib/utils/helpers";
import { Input } from "@shared/ui/input";
import { Button } from "@shared/ui/button";
import type { CategoryAddNewInputProps } from "../model/interface";

const LEVEL_INDENT: Record<1 | 2 | 3, string> = {
  1: "pl-0",
  2: "pl-6",
  3: "pl-12",
};

export function CategoryAddNewInput({
  value,
  onChange,
  onSubmit,
  onCancel,
  placeholder,
  level,
}: CategoryAddNewInputProps) {
  return (
    <div className={cn("flex items-center gap-2 py-1 px-2", LEVEL_INDENT[level])}>
      <span className="w-5 shrink-0" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 text-sm flex-1"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit();
          } else if (e.key === "Escape") {
            onCancel();
          }
        }}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={onSubmit}
        disabled={!value.trim()}
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={onCancel}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
