import { getTranslations } from "next-intl/server";
import { ProductGallery } from "@widgets/product-gallery";
import { ProductInfo } from "@widgets/product-info";
import { ProductDescription } from "@widgets/product-description";
import { SimilarProductsCarousel } from "@widgets/similar-products-carousel";
import { ProductReviewsSection } from "@widgets/product-reviews-section";
import { useProductDetailPage } from "../lib/useProductDetailPage";
import type { ProductDetailPageProps } from "../model/interface";

export async function ProductDetailPage({ product }: ProductDetailPageProps) {
  const {
    galleryImages,
    relatedProducts,
    hasShortDescription,
    hasRelatedProducts,
    // eslint-disable-next-line
  } = useProductDetailPage({ product });
  const t = await getTranslations("product-detail");

  return (
    <>
      <div className="container space-y-12 py-8">
        {/* First row: Gallery + Product Info */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* Left: Gallery */}
          <ProductGallery images={galleryImages} productName={product.name} />

          {/* Right: Product Info - aligned to top */}
          <ProductInfo product={product} className="pt-4" />
        </div>
      </div>

      {/* Short description - full width with borders */}
      {hasShortDescription && (
        <div className="border-y bg-muted/30 py-8">
          <div className="container">
            <div className="mx-auto max-w-4xl space-y-4">
              <h2 className="text-center text-2xl font-semibold">
                {t("aboutProduct")}
              </h2>
              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{
                  __html: product.short_description?.html || "",
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="container space-y-12 py-8">
        {/* Product Description - full width, centered */}
        <ProductDescription product={product} />

        {/* Similar Products Carousel */}
        {hasRelatedProducts && (
          <SimilarProductsCarousel products={relatedProducts} />
        )}
      </div>

      {/* Product Reviews Section - full width with 2-column layout */}
      <div className="border-y bg-muted/30">
        <ProductReviewsSection productSku={product.sku} />
      </div>
    </>
  );
}
