"use client";

import { useState, useCallback, useEffect } from "react";
import { Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProductCard } from "@widgets/product-grid";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@shared/ui/carousel";
import { cn } from "@shared/lib/utils/helpers";
import { Button } from "@shared/ui/button";
import type { FeaturedProductsProps } from "../model/interface";

export default function FeaturedProducts({
  products,
  className,
}: FeaturedProductsProps) {
  const t = useTranslations("featured-products");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Initialize carousel state from API
  // This is intentional: sync carousel state when API becomes available
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section
      id="popular-rentals"
      className={cn("py-20 bg-muted/30 relative", className)}
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
            <Flame className="h-4 w-4" />
            <span>{t("badge")}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: false,
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {products.map((product) => (
                <CarouselItem
                  key={product.uid}
                  className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-4 lg:-left-6" />
            <CarouselNext className="hidden sm:flex -right-4 lg:-right-6" />
          </Carousel>

          {/* Mobile Navigation */}
          <div className="flex sm:hidden items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-1.5">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    current === index
                      ? "w-6 bg-primary"
                      : "w-2 bg-muted-foreground/30"
                  )}
                  onClick={() => api?.scrollTo(index)}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={scrollNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
