"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, Layers } from "lucide-react";
import { cn } from "@shared/lib/utils/helpers";
import { useCategoryShowcase } from "../lib/useCategoryShowcase";
import type { CategoryShowcaseProps } from "../model/interface";
import { useParams } from "next/navigation";

// Color palette for category cards
const categoryColors = [
  "from-violet-500/20 to-purple-500/20 hover:from-violet-500/30 hover:to-purple-500/30",
  "from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30",
  "from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30",
  "from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30",
  "from-pink-500/20 to-rose-500/20 hover:from-pink-500/30 hover:to-rose-500/30",
  "from-indigo-500/20 to-blue-500/20 hover:from-indigo-500/30 hover:to-blue-500/30",
  "from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30",
  "from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30",
  "from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30",
  "from-teal-500/20 to-green-500/20 hover:from-teal-500/30 hover:to-green-500/30",
  "from-lime-500/20 to-emerald-500/20 hover:from-lime-500/30 hover:to-emerald-500/30",
  "from-fuchsia-500/20 to-pink-500/20 hover:from-fuchsia-500/30 hover:to-pink-500/30",
];

const categoryIconColors = [
  "text-violet-600 dark:text-violet-400",
  "text-blue-600 dark:text-blue-400",
  "text-emerald-600 dark:text-emerald-400",
  "text-orange-600 dark:text-orange-400",
  "text-pink-600 dark:text-pink-400",
  "text-indigo-600 dark:text-indigo-400",
  "text-red-600 dark:text-red-400",
  "text-cyan-600 dark:text-cyan-400",
  "text-amber-600 dark:text-amber-400",
  "text-teal-600 dark:text-teal-400",
  "text-lime-600 dark:text-lime-400",
  "text-fuchsia-600 dark:text-fuchsia-400",
];

export default function CategoryShowcase({
  categories,
  className,
}: CategoryShowcaseProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const t = useTranslations("category-showcase");

  const { topLevelCategories, handleCategoryClick, title, subtitle } =
    useCategoryShowcase(categories, locale);

  return (
    <section
      id="category-showcase"
      className={cn("py-20 bg-muted/30 relative", className)}
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Layers className="h-4 w-4" />
            <span>{t("badge")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        </div>

        {/* Categories Grid */}
        {topLevelCategories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {topLevelCategories.map((category, index) => {
              const colorClass = categoryColors[index % categoryColors.length];
              const iconColor =
                categoryIconColors[index % categoryIconColors.length];
              const hasChildren =
                category.children && category.children.length > 0;
              const isSubcategory = category.level >= 3;
              // Use url_path for subcategories (contains full path like "electronics/cameras")
              // Use url_key for parent categories
              const urlPath = category.url_path || category.url_key;

              return (
                <button
                  key={category.uid}
                  onClick={() => handleCategoryClick(urlPath)}
                  className={cn(
                    "group relative p-6 rounded-2xl bg-gradient-to-br border border-border/50",
                    "transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5",
                    "flex flex-col items-center text-center",
                    colorClass,
                  )}
                >
                  {/* Category Icon Placeholder */}
                  <div
                    className={cn(
                      "w-14 h-14 rounded-xl bg-background/80 flex items-center justify-center mb-4",
                      "group-hover:scale-110 transition-transform duration-300",
                    )}
                  >
                    <span className={cn("text-2xl font-bold", iconColor)}>
                      {category.name.charAt(0)}
                    </span>
                  </div>

                  {/* Category Name */}
                  <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2">
                    {category.name}
                  </h3>

                  {/* Subcategory indicator or count */}
                  {isSubcategory ? (
                    <span className="text-xs text-muted-foreground/70">
                      {t("subcategory")}
                    </span>
                  ) : hasChildren ? (
                    <span className="text-xs text-muted-foreground">
                      {category.children!.length} {t("subcategories")}
                    </span>
                  ) : null}

                  {/* Hover Arrow */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Layers className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{t("noCategories")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
