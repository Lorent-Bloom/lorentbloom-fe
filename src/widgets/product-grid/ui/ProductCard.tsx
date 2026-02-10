"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ImageOff, MapPin, User } from "lucide-react";
import { AddToCartButton } from "@features/add-to-cart";
import { useProductCard } from "../lib/useProductCard";
import type { ProductCardProps } from "../model/interface";
import { cn } from "@shared/lib/utils";

export function ProductCard({ product }: ProductCardProps) {
  const {
    locale,
    imageUrl,
    imageLabel,
    price,
    isWishlisted,
    handleToggleWishlist,
    t,
  } = useProductCard({ product });

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-card border border-border/50 transition-[box-shadow,border-color] duration-300 hover:shadow-xl hover:shadow-black/5 hover:border-border">
      {/* Image Section - Full Bleed */}
      <Link
        href={`/${locale}/products/p/${product.url_key}`}
        className="relative aspect-[4/3] overflow-hidden bg-muted"
      >
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={imageLabel || product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110 dark:brightness-[0.85] dark:contrast-[1.1]"
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
            {/* Dark mode overlay for white placeholder images */}
            <div className="absolute inset-0 hidden dark:block bg-black/15 pointer-events-none" />
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground/50">
            <ImageOff className="h-8 w-8" />
            <span className="text-xs">{t("noImage")}</span>
          </div>
        )}

        {/* Gradient overlay for better text readability on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={cn(
            "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
            "bg-white/90 shadow-md backdrop-blur-sm hover:bg-white hover:scale-110",
            "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
            isWishlisted && "opacity-100",
          )}
          aria-label={
            isWishlisted ? t("removeFromWishlist") : t("addToWishlist")
          }
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-all duration-200",
              isWishlisted
                ? "fill-red-500 text-red-500 scale-110"
                : "text-gray-600 hover:text-red-500",
            )}
          />
        </button>
      </Link>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        {/* Name and Location/Customer column */}
        <div className="flex items-start justify-between gap-2">
          {/* Left: Name */}
          <Link
            href={`/${locale}/products/p/${product.url_key}`}
            className="flex-1"
          >
            <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground transition-colors hover:text-primary">
              {product.name}
            </h3>
          </Link>

          {/* Right: Location and Customer */}
          <div className="flex shrink-0 flex-col items-end gap-1">
            {product.city_name && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{product.city_name}</span>
              </div>
            )}
            {product.customer && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>
                  {product.customer.firstname} {product.customer.lastname}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="mt-auto pt-3">
          <span className="text-lg font-bold text-foreground">
            {price.currency} {price.value.toFixed(2)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <div className="mt-3">
          <AddToCartButton
            productId={product.id}
            productSku={product.sku}
            productName={product.name}
            productUrlKey={product.url_key}
            configurableOptions={product.configurable_options}
            reservations={product.reservations}
            productQuantity={product.rental_quantity ?? 1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
