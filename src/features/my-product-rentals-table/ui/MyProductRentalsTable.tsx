"use client";

import { Card, CardContent } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Calendar } from "@shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@shared/ui/popover";
import { Loader2, Eraser, CalendarIcon } from "lucide-react";
import { cn } from "@shared/lib/utils/helpers";
import { useMyProductRentalsTable } from "../lib/useMyProductRentalsTable";
import type { MyProductRentalsTableProps } from "../model/interface";

export default function MyProductRentalsTable(
  props: MyProductRentalsTableProps,
) {
  const {
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
  } = useMyProductRentalsTable(props);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("totalRentals", { count: totalCount })}
        </p>
      </div>

      {/* Date Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <Popover
          open={isCalendarOpen}
          onOpenChange={handleCalendarOpenChange}
          modal
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-10 min-w-[240px] justify-start text-left font-normal",
                !dateRange?.from && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDateRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {hasActiveFilter && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearFilter}
            disabled={isLoading}
            className="h-10 w-10"
          >
            <Eraser className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Desktop view - table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-6 py-3 text-left text-sm font-medium"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="divide-y">
                    {table.getRowModel().rows.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <p className="text-lg font-semibold">
                              {t("noRentals")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {t("noRentalsDescription")}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="hover:bg-muted/50">
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-6 py-4">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile view - vertical cards */}
              <div className="divide-y md:hidden">
                {table.getRowModel().rows.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
                    <p className="text-lg font-semibold">{t("noRentals")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("noRentalsDescription")}
                    </p>
                  </div>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <div key={row.id} className="space-y-3 p-4">
                      {row.getVisibleCells().map((cell) => (
                        <div
                          key={cell.id}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium text-muted-foreground">
                            {typeof cell.column.columnDef.header === "string"
                              ? cell.column.columnDef.header
                              : cell.column.id}
                          </span>
                          <span className="text-sm">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pageInfo.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageInfo.current_page - 1)}
            disabled={pageInfo.current_page === 1 || isLoading}
          >
            {t("previous")}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t("pageInfo", {
              current: pageInfo.current_page,
              total: pageInfo.total_pages,
            })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageInfo.current_page + 1)}
            disabled={
              pageInfo.current_page === pageInfo.total_pages || isLoading
            }
          >
            {t("next")}
          </Button>
        </div>
      )}
    </div>
  );
}
