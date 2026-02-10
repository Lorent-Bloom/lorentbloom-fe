"use client";

import { ArrowDown } from "lucide-react";

interface HomeHeroCTAProps {
  browseLabel: string;
  categoriesLabel: string;
}

export default function HomeHeroCTA({
  browseLabel,
  categoriesLabel,
}: HomeHeroCTAProps) {
  return (
    <div className="inline-flex rounded-full overflow-hidden shadow-lg">
      <button
        onClick={() =>
          document
            .getElementById("popular-rentals")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="h-14 px-8 sm:px-10 text-base sm:text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2 group cursor-pointer"
      >
        <ArrowDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
        {browseLabel}
      </button>
      <button
        onClick={() =>
          document
            .getElementById("category-showcase")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="h-14 px-8 sm:px-10 text-base sm:text-lg font-medium bg-background text-foreground border-y border-r border-border hover:bg-muted transition-colors flex items-center gap-2 group cursor-pointer"
      >
        {categoriesLabel}
        <ArrowDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
      </button>
    </div>
  );
}
