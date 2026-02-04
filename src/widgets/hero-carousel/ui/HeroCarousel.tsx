"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@shared/ui/button";
import { cn } from "@shared/lib/utils/helpers";
import { useHeroCarousel } from "../lib/useHeroCarousel";
import type { HeroCarouselProps } from "../model/interface";

export default function HeroCarousel({ className }: HeroCarouselProps) {
  const {
    slides,
    currentSlide,
    nextSlide,
    previousSlide,
    goToSlide,
    handleCTAClick,
  } = useHeroCarousel();
  const t = useTranslations("hero-carousel");

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      {/* Slides */}
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
          >
            {/* Background Image */}
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="relative h-full flex items-center justify-center">
              <div className="container mx-auto px-4 md:px-6 text-center text-white">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
                  {slide.description}
                </p>
                {slide.cta && (
                  <Button
                    size="lg"
                    onClick={() => handleCTAClick(slide.cta!.href)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {slide.cta.text}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={previousSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
        aria-label={t("previousSlide")}
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
        aria-label={t("nextSlide")}
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75",
            )}
            aria-label={t("goToSlide", { number: index + 1 })}
          />
        ))}
      </div>
    </div>
  );
}
