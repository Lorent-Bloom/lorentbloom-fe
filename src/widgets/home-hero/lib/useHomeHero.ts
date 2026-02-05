"use client";

import { useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export const useHomeHero = () => {
  const t = useTranslations("home-hero");
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(
          `/${locale}/products?search=${encodeURIComponent(searchQuery.trim())}`,
        );
      } else {
        router.push(`/${locale}/products`);
      }
    },
    [searchQuery, router, locale],
  );

  const handleBrowseClick = useCallback(() => {
    router.push(`/${locale}/products`);
  }, [router, locale]);

  const handleInputChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return {
    t,
    searchQuery,
    handleSearch,
    handleBrowseClick,
    handleInputChange,
  };
};
