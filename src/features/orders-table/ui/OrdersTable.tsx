"use client";

import { Card, CardContent } from "@shared/ui/card";
import { useOrdersTable } from "../lib/useOrdersTable";
import type { OrdersTableProps } from "../model/interface";

export default function OrdersTable(props: OrdersTableProps) {
  const { table, flexRender, totalCount, t } = useOrdersTable(props);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("totalRents", { count: totalCount })}
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
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
                        <p className="text-lg font-semibold">{t("noRents")}</p>
                        <p className="text-sm text-muted-foreground">
                          {t("noRentsDescription")}
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
                <p className="text-lg font-semibold">{t("noRents")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("noRentsDescription")}
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
        </CardContent>
      </Card>
    </div>
  );
}
