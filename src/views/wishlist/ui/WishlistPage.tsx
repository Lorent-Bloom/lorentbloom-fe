"use client";

import { Heart } from "lucide-react";
import { Button } from "@shared/ui/button";
import { ProductCard } from "@widgets/product-grid";
import { useWishlistPage } from "../lib/useWishlistPage";
import type { WishlistPageProps } from "../model/interface";

export default function WishlistPage(props: WishlistPageProps) {
  const { t, items, hasItems, handleClearWishlist } = useWishlistPage(props);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="h-8 w-8 fill-red-500 text-red-500" />
          <div>
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            {hasItems && (
              <p className="text-sm text-muted-foreground">
                {t("itemsCount", { count: items.length })}
              </p>
            )}
          </div>
        </div>
        {hasItems && (
          <Button variant="outline" onClick={handleClearWishlist}>
            {t("clearAll")}
          </Button>
        )}
      </div>

      {!hasItems ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Heart className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">{t("emptyTitle")}</h2>
          <p className="text-muted-foreground">{t("emptyDescription")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ProductCard key={item.product.uid} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
}
