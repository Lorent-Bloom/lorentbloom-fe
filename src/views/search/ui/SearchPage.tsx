/**
 * Search View - Main Page Component
 */

"use client";

import { ProductGrid, ProductGridSkeleton } from "@widgets/product-grid";
import { CategorySearchResults } from "@widgets/category-search-results";
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
import { AlertCircle, SearchX } from "lucide-react";
import { useSearchPage } from "../lib/useSearchPage";
import type { SearchPageProps } from "../model/interface";

export function SearchPage({
  searchQuery,
  categoriesData,
  productsData,
  productsError,
  searchParams,
  locale,
}: SearchPageProps) {
  const {
    t,
    products,
    totalCount,
    currentPage,
    totalPages,
    pageSize,
    start,
    end,
    hasProducts,
    hasCategories,
    hasResults,
    hasError,
    displayQuery,
    handlePageChange,
    handlePageSizeChange,
  } = useSearchPage({
    searchQuery,
    categoriesData,
    productsData,
    productsError,
    locale,
  });

  const aggregations = productsData?.aggregations || [];
  const sortValue = parseSortOption(searchParams.sort || "");

  // Error State
  if (hasError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-16 h-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold">{t("error")}</h2>
          <p className="mt-2 text-muted-foreground max-w-md">
            {t("errorDescription")}
          </p>
        </div>
      </div>
    );
  }

  // Empty State - No Results
  if (!hasResults) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {t("searchResultsFor", { query: displayQuery })}
          </h1>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <SearchX className="w-20 h-20 text-muted-foreground/50 mb-6" />
          <h2 className="text-2xl font-semibold mb-2">{t("noResultsTitle")}</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            {t("noResultsDescription")}
          </p>

          {/* Suggestions */}
          <div className="text-left max-w-md">
            <p className="font-medium mb-3">{t("noResultsSuggestions")}</p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>{t("suggestion1")}</li>
              <li>{t("suggestion2")}</li>
              <li>{t("suggestion3")}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t("searchResultsFor", { query: displayQuery })}
        </h1>
        {hasProducts && (
          <p className="text-sm text-muted-foreground">
            {t("showing", { start, end, total: totalCount })}
          </p>
        )}
      </div>

      {/* Categories Section */}
      {hasCategories && (
        <CategorySearchResults
          categories={categoriesData}
          searchQuery={searchQuery}
          locale={locale}
          className="mb-12"
        />
      )}

      {/* Products Section */}
      <section>
        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">{t("productsSection")}</h2>
          {hasProducts && (
            <p className="text-sm text-muted-foreground mt-1">
              {t("showing", { start, end, total: totalCount })}
            </p>
          )}
        </div>

        {/* Main Content: Filters (Left) + Products (Right) */}
        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop Only */}
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

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filters Button */}
            <div className="mb-4 lg:hidden">
              <ProductFiltersClient
                aggregations={aggregations}
                sortValue={sortValue}
              />
            </div>

            {/* Products Grid or Empty State */}
            <div className="mb-6">
              {!productsData ? (
                <ProductGridSkeleton />
              ) : hasProducts ? (
                <ProductGrid products={products} />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/30">
                  <SearchX className="w-12 h-12 text-muted-foreground/50 mb-3" />
                  <p className="text-lg font-medium">{t("noProductsFound")}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("noProductsHint")}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination & Items Per Page */}
            {hasProducts && (
              <div className="mt-6 flex flex-col gap-4 items-center lg:flex-row lg:items-center lg:justify-between">
                <div className="w-full lg:w-auto flex justify-center">
                  <PaginationWrapper
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    previousLabel={t("previous")}
                    nextLabel={t("next")}
                  />
                </div>

                <div className="flex items-center justify-center gap-2 text-sm whitespace-nowrap">
                  <span className="text-muted-foreground">{t("perPage")}:</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={handlePageSizeChange}
                  >
                    <SelectTrigger className="w-20">
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
      </section>
    </div>
  );
}
