"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import type { DateRange } from "react-day-picker";
import type { Reservation } from "@entities/product";

export interface UseRentalDateSelectorProps {
  reservations?: Reservation[];
  minStartDate?: Date;
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  quantity?: number;
}

export const useRentalDateSelector = ({
  reservations = [],
  minStartDate = new Date(),
  dateRange,
  onDateRangeChange,
  quantity = 1,
}: UseRentalDateSelectorProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  // Track if we're in the middle of selecting (have from but not to)
  const isSelectingRef = useRef(false);

  // Custom open change handler - only close when both dates selected
  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      setIsOpen(true);
    } else {
      // Only close if we're NOT in the middle of selecting
      if (!isSelectingRef.current) {
        setIsOpen(false);
      }
    }
  }, []);

  // Parse reservations into date ranges for efficient lookup
  const reservedDateRanges = useMemo(() => {
    return reservations.map((reservation) => ({
      from: new Date(reservation.from_date),
      to: new Date(reservation.to_date),
    }));
  }, [reservations]);

  // Count how many reservations include a specific date
  const countReservationsForDate = useCallback(
    (date: Date): number => {
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);

      return reservedDateRanges.reduce((count, range) => {
        const from = new Date(range.from);
        const to = new Date(range.to);
        from.setHours(0, 0, 0, 0);
        to.setHours(0, 0, 0, 0);
        return checkDate >= from && checkDate <= to ? count + 1 : count;
      }, 0);
    },
    [reservedDateRanges],
  );

  // Check if a date is fully reserved (all units booked)
  const isDateReserved = useCallback(
    (date: Date): boolean => countReservationsForDate(date) >= quantity,
    [countReservationsForDate, quantity],
  );

  // Check if a date should be disabled
  const isDateDisabled = useCallback(
    (date: Date): boolean => {
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);

      const minDate = new Date(minStartDate);
      minDate.setHours(0, 0, 0, 0);

      // Disable dates before minimum start date
      if (checkDate < minDate) {
        return true;
      }

      // Disable reserved dates
      if (isDateReserved(date)) {
        return true;
      }

      // If we have a start date selected, check if selecting this date would span a reservation
      if (dateRange?.from && !dateRange?.to) {
        const start = new Date(dateRange.from);
        start.setHours(0, 0, 0, 0);

        // Only check dates after the start date (potential end dates)
        if (checkDate > start) {
          const hasReservationBetween = reservedDateRanges.some((range) => {
            const rangeFrom = new Date(range.from);
            rangeFrom.setHours(0, 0, 0, 0);
            return rangeFrom > start && rangeFrom <= checkDate;
          });

          if (hasReservationBetween) {
            return true;
          }
        }
      }

      return false;
    },
    [minStartDate, isDateReserved, dateRange, reservedDateRanges],
  );

  const handleDateRangeSelect = useCallback(
    (range: DateRange | undefined) => {
      // react-day-picker sets from === to on first click, we need to handle this
      // Only consider it "complete" if from and to are DIFFERENT dates
      const isComplete =
        range?.from && range?.to && range.from.getTime() !== range.to.getTime();

      // If from === to, treat it as just selecting the start date
      if (
        range?.from &&
        range?.to &&
        range.from.getTime() === range.to.getTime()
      ) {
        // User clicked once - set only 'from', clear 'to'
        onDateRangeChange?.({ from: range.from, to: undefined });
        isSelectingRef.current = true;
      } else if (
        // When both dates were already selected (complete range) and user clicks again,
        // react-day-picker keeps 'from' and updates 'to'. We want to start fresh selection instead.
        dateRange?.from &&
        dateRange?.to &&
        range?.from &&
        range?.to &&
        dateRange.from.getTime() === range.from.getTime() &&
        dateRange.to.getTime() !== range.to.getTime()
      ) {
        // User had complete range and clicked a new date - start fresh with new date as 'from'
        onDateRangeChange?.({ from: range.to, to: undefined });
        isSelectingRef.current = true;
      } else {
        onDateRangeChange?.(range);

        // Update selecting state
        if (range?.from && !range?.to) {
          isSelectingRef.current = true;
        } else {
          isSelectingRef.current = false;
        }

        // Only close popover when BOTH dates are selected AND different
        if (isComplete) {
          setIsOpen(false);
        }
      }
    },
    [onDateRangeChange, dateRange],
  );

  return {
    isOpen,
    setIsOpen,
    handleOpenChange,
    handleDateRangeSelect,
    isDateReserved,
    isDateDisabled,
    reservedDateRanges,
  };
};
