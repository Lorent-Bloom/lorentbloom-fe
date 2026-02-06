"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import type { Category } from "@entities/category";

export const useCategoryNavBar = (categories: Category[]) => {
  // Desktop states
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<
    string | null
  >(null);
  const [expandedMobileSubcategory, setExpandedMobileSubcategory] = useState<
    string | null
  >(null);

  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Desktop: Mouse enter handler
  const handleMouseEnter = useCallback((categoryUid: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenCategoryId(categoryUid);
  }, []);

  // Desktop: Mouse leave handler
  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenCategoryId(null);
    }, 150);
  }, []);

  // Desktop: Close handler
  const handleClose = useCallback(() => {
    setOpenCategoryId(null);
  }, []);

  // Mobile: Toggle main menu
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
    if (isMobileMenuOpen) {
      setExpandedMobileCategory(null);
    }
  }, [isMobileMenuOpen]);

  // Mobile: Toggle category accordion
  const toggleMobileCategory = useCallback((categoryUid: string) => {
    setExpandedMobileCategory((prev) =>
      prev === categoryUid ? null : categoryUid,
    );
    setExpandedMobileSubcategory(null);
  }, []);

  // Mobile: Toggle subcategory accordion
  const toggleMobileSubcategory = useCallback((subcategoryUid: string) => {
    setExpandedMobileSubcategory((prev) =>
      prev === subcategoryUid ? null : subcategoryUid,
    );
  }, []);

  // Close all menus when pathname changes (navigation)
  // This is intentional: reset UI state when user navigates to a new page
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setOpenCategoryId(null);
    setIsMobileMenuOpen(false);
    setExpandedMobileCategory(null);
    setExpandedMobileSubcategory(null);
  }, [pathname]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Get top-level categories - try level 2 first, fallback to any with children
  let topLevelCategories = categories.filter(
    (cat) => cat.level === 2 && cat.children && cat.children.length > 0,
  );

  // If no level 2 categories, find the root category and use its children
  if (topLevelCategories.length === 0) {
    const rootCategory = categories.find((cat) => cat.level === 1);
    if (rootCategory && rootCategory.children) {
      topLevelCategories = rootCategory.children.filter(
        (cat) => cat.children && cat.children.length > 0,
      );
    }
  }

  // Still nothing? Just use any categories with children
  if (topLevelCategories.length === 0) {
    topLevelCategories = categories.filter(
      (cat) => cat.children && cat.children.length > 0,
    );
  }

  return {
    // Desktop
    openCategoryId,
    handleMouseEnter,
    handleMouseLeave,
    handleClose,
    // Mobile
    isMobileMenuOpen,
    expandedMobileCategory,
    expandedMobileSubcategory,
    toggleMobileMenu,
    toggleMobileCategory,
    toggleMobileSubcategory,
    // Shared
    topLevelCategories,
    navRef,
  };
};
