"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { Category } from "@entities/category";

// Fallback categories to show when API returns empty or fails
const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 1,
    uid: "electronics",
    level: 2,
    name: "Electronics",
    path: "1/2",
    url_path: "electronics",
    url_key: "electronics",
    image: null,
    description: "Cameras, drones, audio equipment and more",
    children_count: 4,
    product_count: 25,
    children: [
      { id: 11, uid: "cameras", level: 3, name: "Cameras", path: "1/2/11", url_path: "electronics/cameras", url_key: "cameras", image: null, description: null, children_count: 0, product_count: 8 },
      { id: 12, uid: "drones", level: 3, name: "Drones", path: "1/2/12", url_path: "electronics/drones", url_key: "drones", image: null, description: null, children_count: 0, product_count: 5 },
    ],
  },
  {
    id: 2,
    uid: "outdoor",
    level: 2,
    name: "Outdoor & Camping",
    path: "1/3",
    url_path: "outdoor",
    url_key: "outdoor",
    image: null,
    description: "Tents, hiking gear, and outdoor essentials",
    children_count: 3,
    product_count: 18,
    children: [
      { id: 21, uid: "tents", level: 3, name: "Tents", path: "1/3/21", url_path: "outdoor/tents", url_key: "tents", image: null, description: null, children_count: 0, product_count: 6 },
      { id: 22, uid: "hiking", level: 3, name: "Hiking Gear", path: "1/3/22", url_path: "outdoor/hiking", url_key: "hiking", image: null, description: null, children_count: 0, product_count: 7 },
    ],
  },
  {
    id: 3,
    uid: "sports",
    level: 2,
    name: "Sports & Fitness",
    path: "1/4",
    url_path: "sports",
    url_key: "sports",
    image: null,
    description: "Bikes, skis, and sports equipment",
    children_count: 3,
    product_count: 22,
    children: [
      { id: 31, uid: "bikes", level: 3, name: "Bikes", path: "1/4/31", url_path: "sports/bikes", url_key: "bikes", image: null, description: null, children_count: 0, product_count: 10 },
      { id: 32, uid: "skiing", level: 3, name: "Skiing", path: "1/4/32", url_path: "sports/skiing", url_key: "skiing", image: null, description: null, children_count: 0, product_count: 8 },
    ],
  },
  {
    id: 4,
    uid: "tools",
    level: 2,
    name: "Tools & Equipment",
    path: "1/5",
    url_path: "tools",
    url_key: "tools",
    image: null,
    description: "Power tools, construction equipment",
    children_count: 2,
    product_count: 15,
    children: [
      { id: 41, uid: "power-tools", level: 3, name: "Power Tools", path: "1/5/41", url_path: "tools/power-tools", url_key: "power-tools", image: null, description: null, children_count: 0, product_count: 9 },
    ],
  },
  {
    id: 5,
    uid: "party",
    level: 2,
    name: "Party & Events",
    path: "1/6",
    url_path: "party",
    url_key: "party",
    image: null,
    description: "Tables, chairs, decorations",
    children_count: 2,
    product_count: 12,
    children: [
      { id: 51, uid: "furniture", level: 3, name: "Furniture", path: "1/6/51", url_path: "party/furniture", url_key: "furniture", image: null, description: null, children_count: 0, product_count: 8 },
    ],
  },
  {
    id: 6,
    uid: "vehicles",
    level: 2,
    name: "Vehicles",
    path: "1/7",
    url_path: "vehicles",
    url_key: "vehicles",
    image: null,
    description: "Cars, trailers, and transport",
    children_count: 2,
    product_count: 10,
    children: [
      { id: 61, uid: "trailers", level: 3, name: "Trailers", path: "1/7/61", url_path: "vehicles/trailers", url_key: "trailers", image: null, description: null, children_count: 0, product_count: 5 },
    ],
  },
  {
    id: 7,
    uid: "music",
    level: 2,
    name: "Music & Audio",
    path: "1/8",
    url_path: "music",
    url_key: "music",
    image: null,
    description: "Instruments, speakers, and audio gear",
    children_count: 2,
    product_count: 14,
    children: [
      { id: 71, uid: "instruments", level: 3, name: "Instruments", path: "1/8/71", url_path: "music/instruments", url_key: "instruments", image: null, description: null, children_count: 0, product_count: 8 },
    ],
  },
  {
    id: 8,
    uid: "gaming",
    level: 2,
    name: "Gaming",
    path: "1/9",
    url_path: "gaming",
    url_key: "gaming",
    image: null,
    description: "Consoles, VR, and gaming accessories",
    children_count: 2,
    product_count: 16,
    children: [
      { id: 81, uid: "consoles", level: 3, name: "Consoles", path: "1/9/81", url_path: "gaming/consoles", url_key: "consoles", image: null, description: null, children_count: 0, product_count: 10 },
    ],
  },
  {
    id: 9,
    uid: "photography",
    level: 2,
    name: "Photography",
    path: "1/10",
    url_path: "photography",
    url_key: "photography",
    image: null,
    description: "Lighting, tripods, and studio equipment",
    children_count: 2,
    product_count: 20,
    children: [
      { id: 91, uid: "lighting", level: 3, name: "Lighting", path: "1/10/91", url_path: "photography/lighting", url_key: "lighting", image: null, description: null, children_count: 0, product_count: 12 },
    ],
  },
  {
    id: 10,
    uid: "water-sports",
    level: 2,
    name: "Water Sports",
    path: "1/11",
    url_path: "water-sports",
    url_key: "water-sports",
    image: null,
    description: "Kayaks, paddleboards, and water gear",
    children_count: 2,
    product_count: 11,
    children: [
      { id: 101, uid: "kayaks", level: 3, name: "Kayaks", path: "1/11/101", url_path: "water-sports/kayaks", url_key: "kayaks", image: null, description: null, children_count: 0, product_count: 6 },
    ],
  },
  {
    id: 11,
    uid: "garden",
    level: 2,
    name: "Garden & Lawn",
    path: "1/12",
    url_path: "garden",
    url_key: "garden",
    image: null,
    description: "Mowers, trimmers, and garden tools",
    children_count: 2,
    product_count: 13,
    children: [
      { id: 111, uid: "mowers", level: 3, name: "Mowers", path: "1/12/111", url_path: "garden/mowers", url_key: "mowers", image: null, description: null, children_count: 0, product_count: 7 },
    ],
  },
  {
    id: 12,
    uid: "baby-kids",
    level: 2,
    name: "Baby & Kids",
    path: "1/13",
    url_path: "baby-kids",
    url_key: "baby-kids",
    image: null,
    description: "Strollers, car seats, and toys",
    children_count: 2,
    product_count: 9,
    children: [
      { id: 121, uid: "strollers", level: 3, name: "Strollers", path: "1/13/121", url_path: "baby-kids/strollers", url_key: "strollers", image: null, description: null, children_count: 0, product_count: 5 },
    ],
  },
];

// Flatten categories and subcategories into a single array
const flattenCategories = (categories: Category[], maxItems: number = 12): Category[] => {
  const result: Category[] = [];

  // First, add all parent categories
  for (const cat of categories) {
    if (result.length >= maxItems) break;
    result.push(cat);
  }

  // If we have space, add subcategories to fill the grid
  if (result.length < maxItems) {
    for (const cat of categories) {
      if (result.length >= maxItems) break;
      if (cat.children && cat.children.length > 0) {
        for (const child of cat.children) {
          if (result.length >= maxItems) break;
          // Don't add if already in the list
          if (!result.find(c => c.uid === child.uid)) {
            result.push(child);
          }
        }
      }
    }
  }

  return result;
};

export const useCategoryShowcase = (categories: Category[], locale: string) => {
  const t = useTranslations("category-showcase");
  const router = useRouter();
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
    null,
  );

  // Extract displayable categories from the tree structure
  // Magento returns root category (level 1) with actual categories as children (level 2+)
  const displayCategories = useMemo(() => {
    // Collect all level 2 categories (direct children of root)
    const level2Categories: Category[] = [];

    if (categories && categories.length > 0) {
      for (const cat of categories) {
        if (cat.level === 1 && cat.children && cat.children.length > 0) {
          // This is the root category, get its children
          level2Categories.push(...cat.children);
        } else if (cat.level >= 2) {
          // Already a displayable category
          level2Categories.push(cat);
        }
      }
    }

    // Use fallback categories if no real categories found
    const baseCategories = level2Categories.length > 0 ? level2Categories : FALLBACK_CATEGORIES;

    // Flatten to include subcategories and fill 12 slots (2 rows of 6)
    return flattenCategories(baseCategories, 12);
  }, [categories]);

  const toggleCategory = (categoryUid: string) => {
    setExpandedCategoryId((prev) =>
      prev === categoryUid ? null : categoryUid,
    );
  };

  const handleCategoryClick = (categoryUrlPath: string) => {
    // Navigate to /products/[category-url-path]
    // e.g., /en/products/electronics or /en/products/electronics/cameras
    router.push(`/${locale}/products/${categoryUrlPath}`);
  };

  return {
    topLevelCategories: displayCategories,
    expandedCategoryId,
    toggleCategory,
    handleCategoryClick,
    title: t("title"),
    subtitle: t("subtitle"),
  };
};
