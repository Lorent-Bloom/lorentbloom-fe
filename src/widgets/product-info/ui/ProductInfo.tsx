"use client";

import { MapPin, User, Mail } from "lucide-react";
import { StarRating } from "@shared/ui";
import { cn } from "@shared/lib/utils";
import { AddToCartButton } from "@features/add-to-cart";
import { useProductInfo } from "../lib/useProductInfo";
import type { ProductInfoProps } from "../model/interface";

export function ProductInfo({ product, className }: ProductInfoProps) {
  const { t, finalPrice, regularPrice, hasDiscount, discount } =
    useProductInfo({ product });

  return (
    <div className={cn("space-y-6", className)}>
      {/* Product title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            {t("sku")}: <span className="font-mono">{product.sku}</span>
          </span>
          {product.city_name && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {product.city_name}
            </span>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <StarRating
          rating={(product.rating_summary || 0) / 20}
          maxRating={5}
          size="md"
          showValue
          reviewCount={product.review_count || 0}
        />
      </div>

      {/* Price */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold">
            {finalPrice?.value.toFixed(2) || regularPrice.value.toFixed(2)}{" "}
            {regularPrice.currency}
          </span>
          {hasDiscount && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                {regularPrice.value.toFixed(2)} {regularPrice.currency}
              </span>
              {discount && discount.percent_off > 0 && (
                <span className="rounded-md bg-destructive/10 px-2 py-1 text-sm font-medium text-destructive">
                  -{discount.percent_off}%
                </span>
              )}
            </>
          )}
        </div>
      </div>


      {/* Manufacturer/Vendor */}
      {product.manufacturer && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            {t("manufacturer")}
          </p>
          <p className="text-base">{product.manufacturer}</p>
        </div>
      )}

      {/* Customer Info */}
      {product.customer && (
        <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm font-medium text-muted-foreground">
            {t("listedBy")}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <p className="font-medium">
                {product.customer.firstname} {product.customer.lastname}
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span>{product.customer.email}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add to cart button */}
      <div className="space-y-3">
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
  );
}
