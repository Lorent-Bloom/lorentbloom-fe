import { ProductCard } from "./ProductCard";
import { useProductGrid } from "../lib/useProductGrid";
import type { ProductGridProps } from "../model/interface";

export function ProductGrid({ products }: ProductGridProps) {
  const { t, hasProducts } = useProductGrid({ products });

  if (!hasProducts) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-semibold">{t("noProducts")}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("noProductsDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.uid} product={product} />
      ))}
    </div>
  );
}
