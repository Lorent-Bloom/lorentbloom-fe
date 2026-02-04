"use client";

import { Card, CardContent } from "@shared/ui/card";
import { PaginationWrapper } from "@shared/ui/pagination-wrapper";
import { useRentedProductsTable } from "../lib/useRentedProductsTable";
import type { RentedProductsTableProps } from "../model/interface";

export default function RentedProductsTable(props: RentedProductsTableProps) {
  const {
    table,
    flexRender,
    pageInfo,
    totalCount,
    handleRowClick,
    handlePageChange,
    t,
  } = useRentedProductsTable(props);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("totalRentals", { count: totalCount })}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
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
                    <td colSpan={8} className="px-6 py-12 text-center">
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
                    <tr
                      key={row.id}
                      onClick={() =>
                        handleRowClick(row.original.product_url_key)
                      }
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4"
                          onClick={(e) => {
                            // Prevent row click when clicking on actions dropdown
                            if (cell.column.id === "actions") {
                              e.stopPropagation();
                            }
                          }}
                        >
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
        </CardContent>
      </Card>

      {pageInfo.total_pages > 1 && (
        <PaginationWrapper
          currentPage={pageInfo.current_page}
          totalPages={pageInfo.total_pages}
          onPageChange={handlePageChange}
          previousLabel={t("previous")}
          nextLabel={t("next")}
        />
      )}
    </div>
  );
}
