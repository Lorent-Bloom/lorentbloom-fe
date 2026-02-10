"use client";

import { Moon, Sun, Monitor, Check } from "lucide-react";
import { Button } from "@shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { useThemeToggle } from "../lib/useThemeToggle";
import type { ThemeToggleProps } from "../model/interface";
import { cn } from "@shared/lib/utils";

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const;

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, themeOptions } = useThemeToggle();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("px-2 sm:px-3 min-h-11 min-w-11 sm:min-h-0 sm:min-w-0 focus-visible:ring-offset-0", className)}
        >
          <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {themeOptions.map((option) => {
          const Icon = themeIcons[option.value as keyof typeof themeIcons];
          const isSelected = theme === option.value;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={cn(
                "cursor-pointer gap-3 py-2",
                isSelected && "bg-accent",
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{option.label}</span>
              {isSelected && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
