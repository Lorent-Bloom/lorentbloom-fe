"use client";

import { ProductCard } from "@widgets/product-grid";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@shared/ui/carousel";
import { cn } from "@shared/lib/utils";
import { useSimilarProductsCarousel } from "../lib/useSimilarProductsCarousel";
import type { SimilarProductsCarouselProps } from "../model/interface";

export function SimilarProductsCarousel({
  products,
  title,
  className,
}: SimilarProductsCarouselProps) {
  const { hasProducts, displayTitle } = useSimilarProductsCarousel({
    products,
    title,
  });

  if (!hasProducts) {
    return null;
  }

  return (
    <section className={cn("space-y-6", className)}>
      <h2 className="text-center text-2xl font-bold tracking-tight">
        {displayTitle}
      </h2>
      <div className="relative px-12">
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem
                key={product.uid}
                className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
