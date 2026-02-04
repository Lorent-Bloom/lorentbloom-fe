import { useTranslations } from "next-intl";
import type { ProductDetail } from "@entities/product";

export interface UseProductDescriptionProps {
  product: ProductDetail;
}

export const useProductDescription = ({
  product,
}: UseProductDescriptionProps) => {
  const t = useTranslations("product-description");

  const hasDescription = !!product.description?.html;
  const hasSpecifications =
    !!product.custom_attributes && product.custom_attributes.length > 0;
  const hasVendorInfo = !!product.manufacturer;

  // If no content, don't render anything
  const hasContent = hasDescription || hasSpecifications || hasVendorInfo;

  // If only one section has content, render without tabs
  const contentSections = [
    hasDescription,
    hasSpecifications,
    hasVendorInfo,
  ].filter(Boolean).length;

  const useTabs = contentSections > 1;

  return {
    t,
    hasDescription,
    hasSpecifications,
    hasVendorInfo,
    hasContent,
    useTabs,
  };
};
