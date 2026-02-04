"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { toast } from "sonner";
import {
  getMyProductsRentals,
  type ProductRental,
  type PageInfo,
  type MyProductsRentalsFilter,
} from "@entities/product-rental";
import { createColumns } from "../model/columns";
import type { UseMyProductRentalsTableProps } from "../model/interface";

const PAGE_SIZE = 10;

export const useMyProductRentalsTable = ({
  initialRentals,
  initialPageInfo,
  initialTotalCount,
  locale,
}: UseMyProductRentalsTableProps) => {
  const t = useTranslations("my-product-rentals-table");
  const router = useRouter();

  const [rentals, setRentals] = useState<ProductRental[]>(initialRentals);
  const [pageInfo, setPageInfo] = useState<PageInfo>(initialPageInfo);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  // Track if we're in the middle of selecting (have from but not to)
  const isSelectingRef = useRef(false);

  const columns = useMemo(() => createColumns(t, locale), [t, locale]);

  const table = useReactTable({
    data: rentals,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const formatDateToString = useCallback((date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const formatDateRange = useCallback((): string => {
    if (!dateRange?.from) {
      return t("filterByDate");
    }
    if (!dateRange.to) {
      return format(dateRange.from, "MMM d, yyyy");
    }
    return `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`;
  }, [dateRange, t]);

  const buildFilter = useCallback((): MyProductsRentalsFilter | undefined => {
    if (!dateRange?.from && !dateRange?.to) {
      return undefined;
    }

    return {
      from_date: {
        ...(dateRange?.from && { from: formatDateToString(dateRange.from) }),
        ...(dateRange?.to && { to: formatDateToString(dateRange.to) }),
      },
    };
  }, [dateRange, formatDateToString]);

  const fetchRentals = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      try {
        const filter = buildFilter();
        const result = await getMyProductsRentals({
          pageSize: PAGE_SIZE,
          currentPage: page,
          ...(filter && { filter }),
        });

        if (result.success && result.data) {
          setRentals(result.data.items);
          setPageInfo(result.data.page_info);
          setTotalCount(result.data.total_count);
        } else if (result.error === "SESSION_EXPIRED") {
          toast.error(t("sessionExpired"));
          router.push(`/${locale}/sign-in`);
        } else {
          toast.error(t("fetchError"));
        }
      } catch {
        toast.error(t("fetchError"));
      } finally {
        setIsLoading(false);
      }
    },
    [buildFilter, locale, router, t],
  );

  const handleDateRangeChange = useCallback(
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
        setDateRange({ from: range.from, to: undefined });
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
        setDateRange({ from: range.to, to: undefined });
        isSelectingRef.current = true;
      } else {
        setDateRange(range);

        // Update selecting state
        if (range?.from && !range?.to) {
          isSelectingRef.current = true;
        } else {
          isSelectingRef.current = false;
        }

        // Auto-close and auto-fetch when both dates selected AND different
        if (isComplete) {
          setIsCalendarOpen(false);
          // Auto-apply filter when complete range is selected
          setIsLoading(true);
          getMyProductsRentals({
            pageSize: PAGE_SIZE,
            currentPage: 1,
            filter: {
              from_date: {
                from: formatDateToString(range.from!),
                to: formatDateToString(range.to!),
              },
            },
          })
            .then((result) => {
              if (result.success && result.data) {
                setRentals(result.data.items);
                setPageInfo(result.data.page_info);
                setTotalCount(result.data.total_count);
              } else if (result.error === "SESSION_EXPIRED") {
                toast.error(t("sessionExpired"));
                router.push(`/${locale}/sign-in`);
              } else {
                toast.error(t("fetchError"));
              }
            })
            .catch(() => {
              toast.error(t("fetchError"));
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      }
    },
    [dateRange, formatDateToString, locale, router, t],
  );

  // Custom open change handler - only close when not in middle of selecting
  const handleCalendarOpenChange = useCallback((open: boolean) => {
    if (open) {
      setIsCalendarOpen(true);
    } else {
      // Only close if we're NOT in the middle of selecting
      if (!isSelectingRef.current) {
        setIsCalendarOpen(false);
      }
    }
  }, []);

  const handleClearFilter = useCallback(async () => {
    setDateRange(undefined);
    setIsLoading(true);
    try {
      // Fetch without any filter (same as page refresh)
      const result = await getMyProductsRentals({
        pageSize: PAGE_SIZE,
        currentPage: 1,
      });

      if (result.success && result.data) {
        setRentals(result.data.items);
        setPageInfo(result.data.page_info);
        setTotalCount(result.data.total_count);
      } else if (result.error === "SESSION_EXPIRED") {
        toast.error(t("sessionExpired"));
        router.push(`/${locale}/sign-in`);
      } else {
        toast.error(t("fetchError"));
      }
    } catch {
      toast.error(t("fetchError"));
    } finally {
      setIsLoading(false);
    }
  }, [locale, router, t]);

  const handlePageChange = useCallback(
    (page: number) => {
      fetchRentals(page);
    },
    [fetchRentals],
  );

  const hasActiveFilter = dateRange?.from || dateRange?.to;

  return {
    table,
    flexRender,
    totalCount,
    pageInfo,
    isLoading,
    dateRange,
    hasActiveFilter,
    isCalendarOpen,
    handleCalendarOpenChange,
    formatDateRange,
    handleDateRangeChange,
    handleClearFilter,
    handlePageChange,
    t,
  };
};
