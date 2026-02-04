"use client";

import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import type { DayButtonProps } from "react-day-picker";
import { cn } from "@shared/lib/utils";
import { Button } from "@shared/ui/button";
import { Calendar, CalendarDayButton } from "@shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@shared/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@shared/ui/tooltip";
import { useRentalDateSelector } from "../lib/useRentalDateSelector";
import type { RentalDateSelectorProps } from "../model/interface";

function ReservedDayButton({
  isReserved,
  tooltipText,
  ...props
}: DayButtonProps & { isReserved: boolean; tooltipText: string }) {
  if (isReserved) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative flex aspect-square w-full min-w-8 items-center justify-center">
            <CalendarDayButton {...props} />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <X className="h-4 w-4 text-destructive" strokeWidth={2.5} />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return <CalendarDayButton {...props} />;
}

export default function RentalDateSelector({
  dateRange,
  onDateRangeChange,
  minStartDate = new Date(),
  className,
  reservations = [],
  placeholder,
  quantity = 1,
}: RentalDateSelectorProps) {
  const {
    isOpen,
    handleOpenChange,
    handleDateRangeSelect,
    isDateReserved,
    isDateDisabled,
  } = useRentalDateSelector({
    reservations,
    minStartDate,
    dateRange,
    onDateRangeChange,
    quantity,
  });
  const t = useTranslations("rental-date-selector");

  const alreadyRentedText = t("alreadyRented");

  const createDayButtonWithReservations = () => {
    return function CustomDayButton(props: DayButtonProps) {
      const isReserved = isDateReserved(props.day.date);
      const isDisabled = isDateDisabled(props.day.date);

      return (
        <ReservedDayButton
          {...props}
          isReserved={isReserved}
          tooltipText={alreadyRentedText}
          disabled={isDisabled || props.disabled}
        />
      );
    };
  };

  const formatDateRange = () => {
    if (!dateRange?.from) {
      return placeholder || t("pickStartDate");
    }
    if (!dateRange.to) {
      return format(dateRange.from, "MMM d, yyyy");
    }
    return `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`;
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={handleOpenChange} modal>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !dateRange?.from && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <TooltipProvider>
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeSelect}
              disabled={isDateDisabled}
              numberOfMonths={2}
              components={{
                DayButton: createDayButtonWithReservations(),
              }}
              initialFocus
            />
          </TooltipProvider>
        </PopoverContent>
      </Popover>
    </div>
  );
}
