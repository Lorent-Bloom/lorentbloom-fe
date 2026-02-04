/**
 * Category Search Results Widget - UI Component
 */

"use client";

import Link from "next/link";
import { ChevronRight, Folder } from "lucide-react";
import { useCategorySearchResults } from "../lib/useCategorySearchResults";
import type { CategorySearchResultsProps } from "../model/interface";
import { cn } from "@shared/lib/utils";

export function CategorySearchResults({
  categories,
  searchQuery,
  locale,
  className,
}: CategorySearchResultsProps) {
  const { filteredCategories, handleCategoryClick, t } =
    useCategorySearchResults({
      categories,
      searchQuery,
      locale,
    });

  if (filteredCategories.length === 0) {
    return null;
  }

  return (
    <section className={cn("mb-12", className)}>
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("matchesCount", { count: filteredCategories.length })}
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map(({ category, breadcrumb }) => (
          <Link
            key={category.uid}
            href={`/${locale}/products/${category.url_path}`}
            onClick={() => handleCategoryClick(category)}
            className="group relative flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-accent hover:border-accent-foreground transition-all duration-200"
          >
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Folder className="w-6 h-6 text-primary" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1 overflow-hidden">
                {breadcrumb.map((crumb, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 whitespace-nowrap"
                  >
                    {index > 0 && <ChevronRight className="w-3 h-3" />}
                    <span
                      className={cn(
                        index === breadcrumb.length - 1 &&
                          "font-medium text-foreground",
                      )}
                    >
                      {crumb}
                    </span>
                  </span>
                ))}
              </div>

              {/* Category Name */}
              <h3 className="font-medium text-base group-hover:text-primary transition-colors line-clamp-1">
                {category.name}
              </h3>

              {/* Product Count */}
              {category.product_count > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {t("productsCount", { count: category.product_count })}
                </p>
              )}
            </div>

            {/* Arrow Icon */}
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
