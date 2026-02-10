"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@shared/ui/button";
import { cn } from "@shared/lib/utils/helpers";
import { useMobileNav } from "../lib/useMobileNav";
import type { MobileNavProps } from "../model/interface";

export default function MobileNav(props: MobileNavProps) {
  const {
    open,
    topLevelCategories,
    expandedCategoryId,
    toggleOpen,
    toggleCategory,
  } = useMobileNav(props);
  const t = useTranslations("header");

  return (
    <>
      {/* Menu Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label={t("toggleMenu")}
        onClick={toggleOpen}
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Backdrop overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden transition-opacity duration-300 z-40",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={toggleOpen}
      />

      {/* Slide-in Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 bg-background shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
          <Link
            href={`/${props.locale}`}
            className="flex items-center gap-2"
            onClick={toggleOpen}
          >
            <Image
              src="/logo.png"
              alt=""
              width={32}
              height={32}
              className="object-contain rounded-4xl"
            />
            <span className="text-lg font-bold">{t("brandName")}</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleOpen}
            aria-label={t("closeMenu")}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Scrollable Navigation */}
        <nav className="overflow-y-auto h-[calc(100vh-73px)]">
          <div className="p-4 space-y-1">
            {topLevelCategories.map((category) => (
              <div key={category.uid} className="border-b border-border/50">
                {/* Top-level category */}
                <div className="flex items-center justify-between">
                  <Link
                    href={`/${props.locale}/products?category=${category.uid}`}
                    onClick={toggleOpen}
                    className="flex-1 py-4 px-3 text-base font-semibold hover:bg-accent transition-colors rounded-md"
                  >
                    {category.name}
                  </Link>
                  {category.children && category.children.length > 0 && (
                    <button
                      onClick={() => toggleCategory(category.uid)}
                      className="p-3 hover:bg-accent rounded-md transition-colors"
                      aria-label={t("expandCategory", {
                        category: category.name,
                      })}
                      aria-expanded={expandedCategoryId === category.uid}
                    >
                      {expandedCategoryId === category.uid ? (
                        <ChevronDown className="h-5 w-5 transition-transform" />
                      ) : (
                        <ChevronRight className="h-5 w-5 transition-transform" />
                      )}
                    </button>
                  )}
                </div>

                {/* Subcategories - Expandable */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    expandedCategoryId === category.uid
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0",
                  )}
                >
                  {category.children && category.children.length > 0 && (
                    <div className="pl-4 pb-2 space-y-1">
                      {category.children.map((subcategory) => (
                        <div key={subcategory.uid}>
                          {/* Subcategory */}
                          <Link
                            href={`/${props.locale}/products?category=${subcategory.uid}`}
                            onClick={toggleOpen}
                            className="block py-3 px-3 text-sm font-medium hover:bg-accent/70 rounded-md transition-colors"
                          >
                            {subcategory.name}
                          </Link>

                          {/* Third-level categories */}
                          {subcategory.children &&
                            subcategory.children.length > 0 && (
                              <div className="pl-4 space-y-1">
                                {subcategory.children.map((thirdLevel) => (
                                  <Link
                                    key={thirdLevel.uid}
                                    href={`/${props.locale}/products?category=${thirdLevel.uid}`}
                                    onClick={toggleOpen}
                                    className="block py-2 px-3 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground rounded-md transition-colors"
                                  >
                                    {thirdLevel.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
