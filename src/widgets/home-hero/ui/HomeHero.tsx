"use client";

import { ArrowDown, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@shared/lib/utils/helpers";
import type { HomeHeroProps } from "../model/interface";

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1).replace(/\.0$/, "")}k+`;
  }
  return `${num}+`;
};

export default function HomeHero({ className, stats }: HomeHeroProps) {
  const t = useTranslations("home-hero");

  const scrollToPopularRentals = () => {
    const element = document.getElementById("popular-rentals");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToCategories = () => {
    const element = document.getElementById("category-showcase");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Use real stats or fallback to defaults
  const totalProducts = stats?.totalProducts ?? 0;
  const totalReviews = stats?.totalReviews ?? 0;
  const averageRating = stats?.averageRating ?? 0;

  // Calculate star rating (0-5)
  const starRating = averageRating > 0 ? Math.round(averageRating / 20) : 5;

  return (
    <section
      className={cn(
        "relative min-h-[90vh] flex items-center justify-center overflow-hidden",
        className,
      )}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/5" />

      {/* Animated Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="h-4 w-4" />
            <span>{t("badge")}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <span className="block">{t("headline.line1")}</span>
            <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              {t("headline.line2")}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-14 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            {t("subheadline")}
          </p>

          {/* CTA Button */}
          <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="inline-flex rounded-full overflow-hidden shadow-lg">
              <button
                onClick={scrollToPopularRentals}
                className="h-14 px-8 sm:px-10 text-base sm:text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2 group cursor-pointer"
              >
                <ArrowDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
                {t("browseButton")}
              </button>
              <button
                onClick={scrollToCategories}
                className="h-14 px-8 sm:px-10 text-base sm:text-lg font-medium bg-background text-foreground border-y border-r border-border hover:bg-muted transition-colors flex items-center gap-2 group cursor-pointer"
              >
                {t("categoriesButton")}
                <ArrowDown className="h-5 w-5 group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 pt-8 border-t border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
            <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["👨", "👩", "👨‍🦱", "👩‍🦰"].map((emoji, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-background flex items-center justify-center text-sm"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <span className="text-sm">
                  <span className="font-semibold">
                    {formatNumber(totalProducts)}
                  </span>{" "}
                  {t("trustedBy")}
                </span>
              </div>
              <div className="h-4 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i <= starRating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300 fill-gray-300",
                      )}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-medium">
                  {averageRating > 0 ? (averageRating / 20).toFixed(1) : "5.0"}
                  /5
                </span>
                <span className="text-sm">
                  {t("rating", {
                    count: totalReviews > 0 ? formatNumber(totalReviews) : "0",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
            className="fill-muted/30"
          />
        </svg>
      </div>
    </section>
  );
}
