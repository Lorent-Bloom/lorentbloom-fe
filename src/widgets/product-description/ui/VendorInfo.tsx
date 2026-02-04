import { useTranslations } from "next-intl";
import type { VendorInfoProps } from "../model/interface";

export function VendorInfo({ product }: VendorInfoProps) {
  const t = useTranslations("product-description");

  return (
    <div className="space-y-4 rounded-lg border p-6">
      {product.manufacturer && (
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {t("manufacturer")}
          </p>
          <p className="text-lg font-semibold">{product.manufacturer}</p>
        </div>
      )}
      {product.meta_description && (
        <div>
          <p className="text-sm text-muted-foreground">
            {product.meta_description}
          </p>
        </div>
      )}
    </div>
  );
}
