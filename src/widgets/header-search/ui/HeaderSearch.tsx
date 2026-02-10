"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useHeaderSearch } from "../lib/useHeaderSearch";
import type { HeaderSearchProps } from "../model/interface";
import { cn } from "@shared/lib/utils/helpers";

export default function HeaderSearch({ locale }: HeaderSearchProps) {
  const t = useTranslations("header-search");
  const {
    query,
    results,
    isLoading,
    isOpen,
    searchRef,
    handleQueryChange,
    handleResultClick,
    handleClear,
    handleSearchSubmit,
    handleKeyDown,
  } = useHeaderSearch(locale);

  const inputRef = useRef<HTMLInputElement>(null);
  const [isMac, setIsMac] = useState(false);

  // Detect Mac for keyboard shortcut display
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  // Handle Cmd+K / Ctrl+K keyboard shortcut to focus search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <div ref={searchRef} className="relative">
      {/* Desktop Search - fixed width */}
      <div className="hidden lg:block w-80">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("placeholder")}
            className={cn(
              "w-full h-9 pl-10 pr-16 text-sm rounded-lg",
              "bg-muted/50 border border-border",
              "placeholder:text-muted-foreground/70",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background",
              "transition-colors duration-200",
            )}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {query && (
              <button
                onClick={handleClear}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={t("clear")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {!query && (
              <kbd className="pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium text-foreground/60 select-none">
                {isMac ? "⌘+K" : "Ctrl+K"}
              </kbd>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Input (Always full width) */}
      <div className="lg:hidden relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("placeholder")}
          className={cn(
            "w-full h-10 pl-10 pr-10 text-sm rounded-full",
            "bg-muted/50 border border-border/50",
            "placeholder:text-muted-foreground/70",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background",
            "transition-all duration-200",
          )}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={t("clear")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border/50 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 min-w-[300px]">
          {isLoading ? (
            <div className="p-6 flex items-center justify-center gap-2">
              <div className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">
                {t("searching")}
              </span>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={result.uid}
                    onClick={() => handleResultClick(result.url_key)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent/50 transition-colors text-left",
                      index === 0 && "pt-3",
                    )}
                  >
                    {/* Product Image */}
                    {result.small_image?.url ? (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={result.small_image.url}
                          alt={result.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Search className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {result.name}
                      </p>
                      {result.price_range?.minimum_price?.final_price && (
                        <p className="text-xs text-muted-foreground">
                          {
                            result.price_range.minimum_price.final_price
                              .currency
                          }{" "}
                          {result.price_range.minimum_price.final_price.value.toFixed(
                            2,
                          )}
                          <span className="ml-1 text-muted-foreground/70">
                            / day
                          </span>
                        </p>
                      )}
                    </div>

                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </button>
                ))}
              </div>

              {/* See All Results Button */}
              <div className="border-t">
                <button
                  onClick={handleSearchSubmit}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-primary hover:bg-accent/30 transition-colors"
                >
                  {t("seeAllResults", { query })}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="p-6 text-center">
              <Search className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{t("noResults")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
