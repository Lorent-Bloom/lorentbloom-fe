"use client";

import { useState } from "react";
import type { Category } from "@entities/category";

interface UseMobileNavProps {
  locale: string;
  isAuthenticated: boolean;
  categories: Category[];
}

export const useMobileNav = ({ categories }: UseMobileNavProps) => {
  const [open, setOpen] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    null,
  );

  const toggleOpen = () => setOpen(!open);

  const toggleCategory = (categoryUid: string) => {
    setExpandedCategoryId((prev) =>
      prev === categoryUid ? null : categoryUid,
    );
  };

  const handleCategoryClick = () => {
    setOpen(false);
  };

  // Filter out root category and get only top-level categories
  const topLevelCategories = categories.filter(
    (cat) => cat.level === 2 && cat.children && cat.children.length > 0,
  );

  return {
    open,
    topLevelCategories,
    expandedCategoryId,
    toggleOpen,
    toggleCategory,
    handleCategoryClick,
  };
};
