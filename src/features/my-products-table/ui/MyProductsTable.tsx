"use client";

import { Plus, Search, X } from "lucide-react";
import { Button, Checkbox, Input, Label } from "@shared/ui";
import { Card, CardContent } from "@shared/ui/card";
import { PaginationWrapper } from "@shared/ui/pagination-wrapper";
import { useMyProductsTable } from "../lib/useMyProductsTable";
import type { MyProductsTableProps } from "../model/interface";

export default function MyProductsTable(props: MyProductsTableProps) {
  const {
    table,
    flexRender,
    pageInfo,
    totalCount,
    t,
    searchQuery,
    handleSearchChange,
    includeDisabled,
    onIncludeDisabledChange,
  } = useMyProductsTable(props);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    window.location.href = `/${props.locale}/account/my-products?${params.toString()}`;
  };

  const handleClearSearch = () => {
    handleSearchChange("");
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("totalProducts", { count: totalCount })}
          </p>
        </div>

        {/* Search input and create button */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={t("clearSearch")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button onClick={props.onCreateClick} className="sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            {t("addProduct")}
          </Button>
        </div>

        {/* Filter: Include disabled products */}
        <div className="mt-3 flex items-center space-x-2">
          <Checkbox
            id="include-disabled"
            checked={includeDisabled}
            onCheckedChange={(checked) =>
              onIncludeDisabledChange(checked === true)
            }
          />
          <Label
            htmlFor="include-disabled"
            className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t("includeDisabled")}
          </Label>
        </div>
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
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-lg font-semibold">
                          {t("noProducts")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("noProductsDescription")}
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
                <p className="text-lg font-semibold">{t("noProducts")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("noProductsDescription")}
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
