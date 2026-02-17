"use client";

import Link from "next/link";
import { ChevronRight, ChevronDown, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCategoryNavBar } from "../lib/useCategoryNavBar";
import type { CategoryNavBarProps } from "../model/interface";
import { cn } from "@shared/lib/utils/helpers";
import { WishlistIcon } from "@features/wishlist-icon";
import { CartMenu } from "@widgets/cart-menu";
import { ScrollArea, ScrollBar } from "@shared/ui/scroll-area";

export default function CategoryNavBar({
  categories,
  locale,
  isAuthenticated = false,
  mobileInline = false,
}: CategoryNavBarProps) {
  const t = useTranslations("header");
  const {
    topLevelCategories,
    openCategoryId,
    isMobileMenuOpen,
    expandedMobileCategory,
    expandedMobileSubcategory,
    handleMouseEnter,
    handleMouseLeave,
    toggleMobileMenu,
    toggleMobileCategory,
    toggleMobileSubcategory,
    navRef,
  } = useCategoryNavBar(categories);

  // Helper to get translated category name, falls back to original name
  const getCategoryName = (
    urlKey: string,
    fallbackName: string,
    urlPath?: string,
  ): string => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categoryNames = (t.raw as any)("categoryNames") || {};
    // Try url_path first (full path for nested categories)
    if (urlPath && categoryNames[urlPath]) {
      return categoryNames[urlPath];
    }
    // Then try url_key
    if (categoryNames[urlKey]) {
      return categoryNames[urlKey];
    }
    return fallbackName;
  };

  if (mobileInline) {
    return (
      <div ref={navRef}>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMobileMenu}
            className="flex items-center gap-1.5 py-2 min-h-11 text-sm font-medium shrink-0"
            aria-expanded={isMobileMenuOpen}
            aria-label={t("toggleMenu")}
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isMobileMenuOpen && "rotate-180",
              )}
            />
          </button>

          {isAuthenticated && (
            <div className="flex items-center gap-1">
              <WishlistIcon />
              <CartMenu />
            </div>
          )}
        </div>

        {/* Mobile Dropdown Content */}
        <div
          className={cn(
            "fixed left-0 right-0 top-[calc(var(--header-height,7rem))] z-50 overflow-hidden transition-all duration-300 ease-in-out bg-background border-t border-border/40",
            isMobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="container mx-auto px-4 py-4 overflow-y-auto max-h-[70vh]">
            <div>
              <div className="space-y-1">
                {topLevelCategories.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-muted-foreground">
                    {t("loadingCategories")}
                  </p>
                ) : (
                  topLevelCategories.map((category) => (
                    <div key={category.uid}>
                      <div className="flex items-center">
                        <Link
                          href={`/${locale}/products/${category.url_key}`}
                          className="flex-1 px-3 py-2.5 text-sm font-medium rounded-l-lg hover:bg-accent transition-colors"
                        >
                          {getCategoryName(
                            category.url_key,
                            category.name,
                            category.url_path,
                          )}
                        </Link>
                        {category.children && category.children.length > 0 && (
                          <button
                            onClick={() => toggleMobileCategory(category.uid)}
                            className="p-2.5 rounded-r-lg hover:bg-accent transition-colors"
                            aria-expanded={expandedMobileCategory === category.uid}
                            aria-label={t("expandCategory", {
                              category: getCategoryName(
                                category.url_key,
                                category.name,
                                category.url_path,
                              ),
                            })}
                          >
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                                expandedMobileCategory === category.uid && "rotate-180",
                              )}
                            />
                          </button>
                        )}
                      </div>

                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-200 ease-in-out",
                          expandedMobileCategory === category.uid
                            ? "max-h-[500px] opacity-100"
                            : "max-h-0 opacity-0",
                        )}
                      >
                        {category.children && category.children.length > 0 && (
                          <div className="ml-4 pl-3 border-l border-border/50 space-y-0.5 py-1">
                            {category.children.map((subcategory) => (
                              <div key={subcategory.uid}>
                                {subcategory.children && subcategory.children.length > 0 ? (
                                  <>
                                    <div className="flex items-center">
                                      <Link
                                        href={`/${locale}/products/${category.url_key}/${subcategory.url_key}`}
                                        className="flex-1 flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-l-md transition-colors"
                                      >
                                        <ChevronRight className="h-3 w-3" />
                                        {getCategoryName(subcategory.url_key, subcategory.name, subcategory.url_path)}
                                      </Link>
                                      <button
                                        onClick={() => toggleMobileSubcategory(subcategory.uid)}
                                        className="p-2 rounded-r-md hover:bg-accent/50 transition-colors"
                                        aria-expanded={expandedMobileSubcategory === subcategory.uid}
                                        aria-label={t("expandCategory", {
                                          category: getCategoryName(subcategory.url_key, subcategory.name, subcategory.url_path),
                                        })}
                                      >
                                        <ChevronDown
                                          className={cn(
                                            "h-3 w-3 text-muted-foreground transition-transform duration-200",
                                            expandedMobileSubcategory === subcategory.uid && "rotate-180",
                                          )}
                                        />
                                      </button>
                                    </div>
                                    <div
                                      className={cn(
                                        "overflow-hidden transition-all duration-200 ease-in-out",
                                        expandedMobileSubcategory === subcategory.uid
                                          ? "max-h-[500px] opacity-100"
                                          : "max-h-0 opacity-0",
                                      )}
                                    >
                                      <div className="ml-4 pl-3 border-l border-border/30 space-y-0.5 py-1">
                                        {subcategory.children.map((thirdLevel) => (
                                          <Link
                                            key={thirdLevel.uid}
                                            href={`/${locale}/products/${category.url_key}/${subcategory.url_key}/${thirdLevel.url_key}`}
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                                          >
                                            <ChevronRight className="h-3 w-3" />
                                            {getCategoryName(thirdLevel.url_key, thirdLevel.name, thirdLevel.url_path)}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <Link
                                    href={`/${locale}/products/${category.url_key}/${subcategory.url_key}`}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                                  >
                                    <ChevronRight className="h-3 w-3" />
                                    {getCategoryName(subcategory.url_key, subcategory.name, subcategory.url_path)}
                                  </Link>
                                )}
                              </div>
                            ))}
                            <Link
                              href={`/${locale}/products/${category.url_key}`}
                              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-accent/50 rounded-md transition-colors"
                            >
                              {t("viewAllInCategory", {
                                category: getCategoryName(category.url_key, category.name, category.url_path),
                              })}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={navRef} className="border-b border-border/40">
      {/* MOBILE: Collapsible menu toggle */}
      <div className="lg:hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            <button
              onClick={toggleMobileMenu}
              className="flex items-center gap-2 py-2 min-h-11 text-sm font-medium"
              aria-expanded={isMobileMenuOpen}
              aria-label={t("toggleMenu")}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
              <span className="uppercase tracking-wide">{t("catalog")}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isMobileMenuOpen && "rotate-180",
                )}
              />
            </button>

            {/* Mobile: Wishlist and Cart */}
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <WishlistIcon />
                <CartMenu />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Content */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out bg-background border-t border-border/40",
            isMobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="container mx-auto px-4 py-4 overflow-y-auto max-h-[70vh]">
            {/* Categories Section */}
            <div>
              <div className="space-y-1">
                {topLevelCategories.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-muted-foreground">
                    {t("loadingCategories")}
                  </p>
                ) : (
                  topLevelCategories.map((category) => (
                    <div key={category.uid}>
                      {/* Category Header */}
                      <div className="flex items-center">
                        <Link
                          href={`/${locale}/products/${category.url_key}`}
                          className="flex-1 px-3 py-2.5 text-sm font-medium rounded-l-lg hover:bg-accent transition-colors"
                        >
                          {getCategoryName(
                            category.url_key,
                            category.name,
                            category.url_path,
                          )}
                        </Link>
                        {category.children && category.children.length > 0 && (
                          <button
                            onClick={() => toggleMobileCategory(category.uid)}
                            className="p-2.5 rounded-r-lg hover:bg-accent transition-colors"
                            aria-expanded={
                              expandedMobileCategory === category.uid
                            }
                            aria-label={t("expandCategory", {
                              category: getCategoryName(
                                category.url_key,
                                category.name,
                                category.url_path,
                              ),
                            })}
                          >
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                                expandedMobileCategory === category.uid &&
                                  "rotate-180",
                              )}
                            />
                          </button>
                        )}
                      </div>

                      {/* Subcategories */}
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-200 ease-in-out",
                          expandedMobileCategory === category.uid
                            ? "max-h-[500px] opacity-100"
                            : "max-h-0 opacity-0",
                        )}
                      >
                        {category.children && category.children.length > 0 && (
                          <div className="ml-4 pl-3 border-l border-border/50 space-y-0.5 py-1">
                            {category.children.map((subcategory) => (
                              <div key={subcategory.uid}>
                                {subcategory.children &&
                                subcategory.children.length > 0 ? (
                                  <>
                                    {/* Subcategory with children - expandable */}
                                    <div className="flex items-center">
                                      <Link
                                        href={`/${locale}/products/${category.url_key}/${subcategory.url_key}`}
                                        className="flex-1 flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-l-md transition-colors"
                                      >
                                        <ChevronRight className="h-3 w-3" />
                                        {getCategoryName(
                                          subcategory.url_key,
                                          subcategory.name,
                                          subcategory.url_path,
                                        )}
                                      </Link>
                                      <button
                                        onClick={() =>
                                          toggleMobileSubcategory(
                                            subcategory.uid,
                                          )
                                        }
                                        className="p-2 rounded-r-md hover:bg-accent/50 transition-colors"
                                        aria-expanded={
                                          expandedMobileSubcategory ===
                                          subcategory.uid
                                        }
                                        aria-label={t("expandCategory", {
                                          category: getCategoryName(
                                            subcategory.url_key,
                                            subcategory.name,
                                            subcategory.url_path,
                                          ),
                                        })}
                                      >
                                        <ChevronDown
                                          className={cn(
                                            "h-3 w-3 text-muted-foreground transition-transform duration-200",
                                            expandedMobileSubcategory ===
                                              subcategory.uid && "rotate-180",
                                          )}
                                        />
                                      </button>
                                    </div>

                                    {/* Third-level children */}
                                    <div
                                      className={cn(
                                        "overflow-hidden transition-all duration-200 ease-in-out",
                                        expandedMobileSubcategory ===
                                          subcategory.uid
                                          ? "max-h-[500px] opacity-100"
                                          : "max-h-0 opacity-0",
                                      )}
                                    >
                                      <div className="ml-4 pl-3 border-l border-border/30 space-y-0.5 py-1">
                                        {subcategory.children.map(
                                          (thirdLevel) => (
                                            <Link
                                              key={thirdLevel.uid}
                                              href={`/${locale}/products/${category.url_key}/${subcategory.url_key}/${thirdLevel.url_key}`}
                                              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                                            >
                                              <ChevronRight className="h-3 w-3" />
                                              {getCategoryName(
                                                thirdLevel.url_key,
                                                thirdLevel.name,
                                                thirdLevel.url_path,
                                              )}
                                            </Link>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  /* Subcategory without children - plain link */
                                  <Link
                                    href={`/${locale}/products/${category.url_key}/${subcategory.url_key}`}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                                  >
                                    <ChevronRight className="h-3 w-3" />
                                    {getCategoryName(
                                      subcategory.url_key,
                                      subcategory.name,
                                      subcategory.url_path,
                                    )}
                                  </Link>
                                )}
                              </div>
                            ))}

                            {/* View All Link */}
                            <Link
                              href={`/${locale}/products/${category.url_key}`}
                              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-accent/50 rounded-md transition-colors"
                            >
                              {t("viewAllInCategory", {
                                category: getCategoryName(
                                  category.url_key,
                                  category.name,
                                  category.url_path,
                                ),
                              })}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP: Horizontal category pills */}
      <div className="hidden lg:block relative" onMouseLeave={handleMouseLeave}>
        <div className="container mx-auto px-4 md:px-6">
          <ScrollArea className="w-full">
            <nav data-tour="category-nav" className="flex items-center gap-2 py-2 w-max mx-auto">
              {topLevelCategories.length === 0 ? (
                <div className="text-muted-foreground text-sm py-2">
                  {t("loadingCategories")}
                </div>
              ) : (
                topLevelCategories.map((category) => (
                  <div
                    key={category.uid}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(category.uid)}
                  >
                    {/* Category Pill */}
                    <Link
                      href={`/${locale}/products/${category.url_key}`}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200 whitespace-nowrap",
                        openCategoryId === category.uid
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-transparent hover:border-border hover:bg-accent",
                      )}
                    >
                      {getCategoryName(
                        category.url_key,
                        category.name,
                        category.url_path,
                      )}
                    </Link>
                  </div>
                ))
              )}
            </nav>
            <ScrollBar orientation="horizontal" className="h-1.5" />
          </ScrollArea>
        </div>

        {/* Mega Menu Dropdown */}
        {openCategoryId &&
          topLevelCategories.map(
            (category) =>
              category.uid === openCategoryId &&
              category.children &&
              category.children.length > 0 && (
                <div
                  key={`dropdown-${category.uid}`}
                  className="absolute left-0 right-0 top-full z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={() => handleMouseEnter(category.uid)}
                >
                  <div className="container mx-auto px-4 md:px-6">
                    <div className="bg-background border border-t-0 rounded-b-xl shadow-xl">
                      <div className="p-6">
                        {/* Header Row */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b">
                          <h3 className="text-lg font-semibold">
                            {getCategoryName(
                              category.url_key,
                              category.name,
                              category.url_path,
                            )}
                          </h3>
                          <Link
                            href={`/${locale}/products/${category.url_key}`}
                            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                          >
                            {t("viewAll", {
                              category: getCategoryName(
                                category.url_key,
                                category.name,
                                category.url_path,
                              ),
                            })}
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>

                        {/* Subcategories Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-4">
                          {category.children.map((subcategory) => (
                            <div key={subcategory.uid} className="space-y-2">
                              {/* Subcategory Title */}
                              <Link
                                href={`/${locale}/products/${category.url_key}/${subcategory.url_key}`}
                                className="block font-semibold text-sm text-foreground hover:text-primary transition-colors"
                              >
                                {getCategoryName(
                                  subcategory.url_key,
                                  subcategory.name,
                                  subcategory.url_path,
                                )}
                              </Link>

                              {/* Third-level Items */}
                              {subcategory.children &&
                                subcategory.children.length > 0 && (
                                  <ul className="space-y-1">
                                    {subcategory.children.map((thirdLevel) => (
                                      <li key={thirdLevel.uid}>
                                        <Link
                                          href={`/${locale}/products/${category.url_key}/${subcategory.url_key}/${thirdLevel.url_key}`}
                                          className="block text-sm text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all duration-150"
                                        >
                                          {getCategoryName(
                                            thirdLevel.url_key,
                                            thirdLevel.name,
                                            thirdLevel.url_path,
                                          )}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ),
          )}
      </div>
    </div>
  );
}
