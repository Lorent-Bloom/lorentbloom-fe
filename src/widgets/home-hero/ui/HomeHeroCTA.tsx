"use client";

import { Search, HandCoins } from "lucide-react";
import Link from "next/link";
import { useHomeHeroCTA } from "../lib/useHomeHeroCTA";

interface HomeHeroCTAProps {
  variant: "rent" | "lend";
}

export default function HomeHeroCTA({ variant }: HomeHeroCTAProps) {
  const { rentCta, lendCta, lendHref, handleRentClick } = useHomeHeroCTA();

  if (variant === "rent") {
    return (
      <button
        onClick={handleRentClick}
        className="h-14 px-8 sm:px-10 text-base sm:text-lg font-medium rounded-full bg-white text-black hover:bg-white/80 transition-colors flex items-center justify-center cursor-pointer"
      >
        <Search className="h-5 w-5 mr-2" />
        {rentCta}
      </button>
    );
  }

  return (
    <Link
      href={lendHref}
      className="h-14 px-8 sm:px-10 text-base sm:text-lg font-medium rounded-full bg-white text-black hover:bg-white/80 transition-colors flex items-center justify-center"
    >
      <HandCoins className="h-5 w-5 mr-2" />
      {lendCta}
    </Link>
  );
}
