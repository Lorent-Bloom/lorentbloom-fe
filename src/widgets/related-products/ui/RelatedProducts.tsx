import { ProductCard } from "@widgets/product-grid";
import { cn } from "@shared/lib/utils";
import { useRelatedProducts } from "../lib/useRelatedProducts";
import type { RelatedProductsProps } from "../model/interface";

export function RelatedProducts({
  products,
  title,
  className,
}: RelatedProductsProps) {
  const { hasProducts, displayTitle } = useRelatedProducts({ products, title });

  if (!hasProducts) {
    return null;
  }

  return (
    <section className={cn("space-y-6", className)}>
      <h2 className="text-2xl font-bold tracking-tight">{displayTitle}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.uid} product={product} />
        ))}
      </div>
    </section>
  );
}
