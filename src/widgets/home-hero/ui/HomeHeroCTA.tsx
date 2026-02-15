"use client";

import { Search, HandCoins } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

interface HomeHeroCTAProps {
  rentLabel: string;
  lendLabel: string;
}

export default function HomeHeroCTA({ rentLabel, lendLabel }: HomeHeroCTAProps) {
  const locale = useLocale();

  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={() => {
          const el = document.getElementById("category-showcase");
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }}
        className="h-14 px-8 sm:px-10 text-base sm:text-lg font-medium rounded-full bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80 transition-colors flex items-center justify-center cursor-pointer"
      >
        <Search className="h-5 w-5 mr-2" />
        {rentLabel}
      </button>
      <Link
        href={`/${locale}/account/my-products`}
        className="h-14 px-8 sm:px-10 text-base sm:text-lg font-medium rounded-full bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80 transition-colors flex items-center justify-center"
      >
        <HandCoins className="h-5 w-5 mr-2" />
        {lendLabel}
      </Link>
    </div>
  );
}
