import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { cn } from "@shared/lib/utils/helpers";
import type { HomeHeroProps } from "../model/interface";
import HomeHeroCTA from "./HomeHeroCTA";

export default async function HomeHero({ className }: HomeHeroProps) {
  const t = await getTranslations("home-hero");

  return (
    <section
      className={cn(
        "relative min-h-screen flex items-center overflow-hidden",
        className,
      )}
    >
      {/* Background Image */}
      <Image
        src="/banner.jpeg"
        alt=""
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row gap-12 md:gap-8 lg:gap-16">
          {/* Lend Half - Mobile: top-right (order-1), Desktop: right (order-2) */}
          <div className="flex-1 flex flex-col items-end text-right order-1 md:order-2 pl-16 md:pl-0">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              {t("lend.headline")}
            </h2>
            <p className="text-base sm:text-lg text-white/80 max-w-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              {t("lend.description")}
            </p>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <HomeHeroCTA variant="lend" />
            </div>
          </div>

          {/* Rent Half - Mobile: bottom-left (order-2), Desktop: left (order-1) */}
          <div className="flex-1 flex flex-col items-start text-left order-2 md:order-1 pr-16 md:pr-0">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              {t("rent.headline")}
            </h2>
            <p className="text-base sm:text-lg text-white/80 max-w-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              {t("rent.description")}
            </p>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <HomeHeroCTA variant="rent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
