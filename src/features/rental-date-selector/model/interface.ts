import type { DateRange } from "react-day-picker";
import type { Reservation } from "@entities/product";

export interface RentalPeriod {
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export interface RentalDateSelectorProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  minStartDate?: Date;
  className?: string;
  reservations?: Reservation[];
  placeholder?: string;
  quantity?: number;
}
