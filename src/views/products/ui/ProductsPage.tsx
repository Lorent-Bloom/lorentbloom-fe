"use client";

import { ProductGrid, ProductGridSkeleton } from "@widgets/product-grid";
import { parseSortOption } from "@features/product-sort";
import { ProductFiltersClient } from "@features/product-filters";
import { PaginationWrapper } from "@shared/ui/pagination-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { useProductsPage } from "../lib/useProductsPage";
import type { ProductsPageProps } from "../model/interface";

export function ProductsPage({ data, error, searchParams }: ProductsPageProps) {
  const {
    t,
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    start,
    end,
    hasData,
    hasProducts,
    hasError,
  } = useProductsPage({ data, error });

  const aggregations = data?.aggregations || [];
  const sortValue = parseSortOption(searchParams.sort || "");

  if (hasError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-2xl font-bold">{t("error")}</h2>
          <p className="mt-2 text-muted-foreground">{t("errorDescription")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        {hasProducts && (
          <p className="mt-1 text-sm text-muted-foreground">
            {t("showing", { start, end, total: totalCount })}
          </p>
        )}
      </div>

      {/* Main Content: Filters (Left) + Products (Right) */}
      <div className="flex gap-6">
        {/* Filters Sidebar - Left - Sticky */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-[120px] max-h-[calc(100vh-140px)] overflow-y-auto">
            <div className="rounded-lg border p-4">
              <ProductFiltersClient
                aggregations={aggregations}
                sortValue={sortValue}
              />
            </div>
          </div>
        </aside>

        {/* Products Section - Right */}
        <div className="flex-1 min-w-0">
          {/* Mobile Filters Button */}
          <div className="mb-4 lg:hidden">
            <ProductFiltersClient
              aggregations={aggregations}
              sortValue={sortValue}
            />
          </div>

          {/* Products Grid */}
          <div className="mb-6">
            {!hasData ? (
              <ProductGridSkeleton />
            ) : (
              <ProductGrid products={data!.items} />
            )}
          </div>

          {/* Pagination & Items Per Page - Bottom */}
          {hasProducts && (
            <div className="mt-6 flex flex-col gap-4 items-center lg:flex-row lg:items-center lg:justify-between">
              <div className="w-full lg:w-auto flex justify-center">
                <PaginationWrapper
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  previousLabel={t("pagination.previous")}
                  nextLabel={t("pagination.next")}
                />
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-muted-foreground whitespace-nowrap">
                  {t("perPage")}
                </span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger className="w-20 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="36">36</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
