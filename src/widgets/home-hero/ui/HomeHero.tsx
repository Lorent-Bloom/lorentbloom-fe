import { getTranslations } from "next-intl/server";
import { cn } from "@shared/lib/utils/helpers";
import type { HomeHeroProps } from "../model/interface";
import HomeHeroCTA from "./HomeHeroCTA";

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1).replace(/\.0$/, "")}k+`;
  }
  return `${num}+`;
};

export default async function HomeHero({ className, stats }: HomeHeroProps) {
  const t = await getTranslations("home-hero");

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
        <div className="max-w-7xl mx-auto text-center">
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
            <HomeHeroCTA
              rentLabel={t("rentButton")}
              lendLabel={t("lendButton")}
            />
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
