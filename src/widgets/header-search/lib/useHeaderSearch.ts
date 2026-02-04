"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getProducts } from "@entities/product";
import type { SearchResult } from "../model/interface";

export const useHeaderSearch = (locale: string) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false);
    setQuery("");
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  // Search products when query length >= 3
  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 3) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setIsOpen(true);

      try {
        const result = await getProducts({
          search: query,
          pageSize: 8,
          currentPage: 1,
        });

        if (result.data?.items) {
          setResults(result.data.items as SearchResult[]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  const handleResultClick = (urlKey: string) => {
    router.push(`/${locale}/products/p/${urlKey}`);
    setIsOpen(false);
    setQuery("");
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleSearchSubmit = () => {
    if (query.trim().length >= 3) {
      router.push(
        `/${locale}/product-search?q=${encodeURIComponent(query.trim())}`,
      );
      setIsOpen(false);
      setQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return {
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
  };
};
