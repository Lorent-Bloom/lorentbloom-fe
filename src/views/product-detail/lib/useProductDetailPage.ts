import type { ProductDetail } from "@entities/product";

export interface UseProductDetailPageProps {
  product: ProductDetail;
}

export const useProductDetailPage = ({
  product,
}: UseProductDetailPageProps) => {
  // Prepare images for gallery
  const galleryImages =
    product.media_gallery && product.media_gallery.length > 0
      ? product.media_gallery.filter((entry) => !entry.disabled && entry.url)
      : product.image
        ? [
            {
              url: product.image.url,
              label: product.image.label,
              position: 0,
              disabled: false,
            },
          ]
        : [];

  const relatedProducts =
    product.related_products || product.upsell_products || [];

  const hasShortDescription = !!product.short_description?.html;
  const hasRelatedProducts = relatedProducts.length > 0;

  return {
    galleryImages,
    relatedProducts,
    hasShortDescription,
    hasRelatedProducts,
  };
};
