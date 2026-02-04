import { Tabs, TabsList, TabsTrigger, TabsContent } from "@shared/ui";
import { cn } from "@shared/lib/utils";
import { useProductDescription } from "../lib/useProductDescription";
import { SpecificationsTable } from "./SpecificationsTable";
import { VendorInfo } from "./VendorInfo";
import type { ProductDescriptionProps } from "../model/interface";

export function ProductDescription({
  product,
  className,
}: ProductDescriptionProps) {
  const {
    t,
    hasDescription,
    hasSpecifications,
    hasVendorInfo,
    hasContent,
    useTabs,
  } = useProductDescription({ product });

  if (!hasContent) {
    return null;
  }

  if (!useTabs) {
    return (
      <div
        className={cn(
          "mx-auto max-w-4xl space-y-4 rounded-lg bg-muted/30 p-6",
          className,
        )}
      >
        {hasDescription && (
          <div>
            <h2 className="mb-4 text-center text-2xl font-semibold">
              {t("description")}
            </h2>
            <div
              className="prose max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: product.description!.html,
              }}
            />
          </div>
        )}
        {hasSpecifications && (
          <div>
            <h2 className="mb-4 text-center text-2xl font-semibold">
              {t("specifications")}
            </h2>
            <SpecificationsTable attributes={product.custom_attributes!} />
          </div>
        )}
        {hasVendorInfo && (
          <div>
            <h2 className="mb-4 text-center text-2xl font-semibold">
              {t("vendorInfo")}
            </h2>
            <VendorInfo product={product} />
          </div>
        )}
      </div>
    );
  }

  // Multiple sections - use tabs
  return (
    <div
      className={cn(
        "mx-auto max-w-4xl space-y-4 rounded-lg bg-muted/30 p-6",
        className,
      )}
    >
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="w-full justify-center">
          {hasDescription && (
            <TabsTrigger value="description">{t("description")}</TabsTrigger>
          )}
          {hasSpecifications && (
            <TabsTrigger value="specifications">
              {t("specifications")}
            </TabsTrigger>
          )}
          {hasVendorInfo && (
            <TabsTrigger value="vendor">{t("vendorInfo")}</TabsTrigger>
          )}
        </TabsList>

        {hasDescription && (
          <TabsContent value="description" className="space-y-4">
            <div
              className="prose max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: product.description!.html,
              }}
            />
          </TabsContent>
        )}

        {hasSpecifications && (
          <TabsContent value="specifications" className="space-y-4">
            <SpecificationsTable attributes={product.custom_attributes!} />
          </TabsContent>
        )}

        {hasVendorInfo && (
          <TabsContent value="vendor" className="space-y-4">
            <VendorInfo product={product} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
