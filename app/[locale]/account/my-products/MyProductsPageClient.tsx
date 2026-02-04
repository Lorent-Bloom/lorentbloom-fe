"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Package, Plus } from "lucide-react";
import { toast } from "sonner";
import { MyProductsTable } from "@features/my-products-table";
import { ProductForm } from "@features/product-form";
import { Button } from "@shared/ui";
import type {
  CustomerProduct,
  CustomerProductsResult,
} from "@entities/customer-product";
import type { CategoryTree } from "@entities/category";
import type { City } from "@entities/city";

interface MyProductsPageClientProps {
  initialData: CustomerProductsResult | null;
  error: string | null;
  locale: string;
  includeDisabled: boolean;
  categories: CategoryTree[];
  cities: City[];
  hasIdnp: boolean;
}

export function MyProductsPageClient({
  initialData,
  error,
  locale,
  includeDisabled,
  categories,
  cities,
  hasIdnp,
}: MyProductsPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("my-products-table");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] =
    useState<CustomerProduct | null>(null);

  // Show error toast on mount if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Show IDNP warning toast on mount if user doesn't have IDNP
  useEffect(() => {
    if (!hasIdnp) {
      toast.error(t("idnpRequired"), {
        id: "idnp-required",
        description: (
          <div className="flex flex-col gap-3">
            <span>{t("idnpRequiredDescription")}</span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                router.push(
                  `/${locale}/account/settings?highlight=personal_number`
                )
              }
            >
              {t("goToSettings")}
            </Button>
          </div>
        ),
        duration: 10000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = () => {
    setFormMode("create");
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: CustomerProduct) => {
    setFormMode("edit");
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleSuccess = () => {
    // Navigate to page 1 to see the newly created/updated product
    const params = new URLSearchParams();
    params.set("page", "1");
    if (includeDisabled) {
      params.set("includeDisabled", "true");
    }
    router.push(`/${locale}/account/my-products?${params.toString()}`);
    router.refresh();
  };

  const handleIncludeDisabledChange = (newIncludeDisabled: boolean) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    const currentSearch = searchParams.get("search");
    if (currentSearch) {
      params.set("search", currentSearch);
    }
    if (newIncludeDisabled) {
      params.set("includeDisabled", "true");
    }
    router.push(`/${locale}/account/my-products?${params.toString()}`);
    router.refresh();
  };

  // Show empty state only if there's an error AND no data
  // (Don't show it when search returns no results - that's handled by the table)
  if (error && !initialData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">
            {t("failedToLoadProducts")}
          </h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">{error}</p>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("addProduct")}
          </Button>
        </div>

        <ProductForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          mode={formMode}
          product={selectedProduct}
          onSuccess={handleSuccess}
          locale={locale}
          categories={categories}
          cities={cities}
          hasIdnp={hasIdnp}
        />
      </div>
    );
  }

  // If we have data (even if empty), show the table with search/filter UI
  if (!initialData) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MyProductsTable
        initialData={initialData}
        locale={locale}
        includeDisabled={includeDisabled}
        onEdit={handleEdit}
        onCreateClick={handleCreate}
        onIncludeDisabledChange={handleIncludeDisabledChange}
      />

      <ProductForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        product={selectedProduct}
        onSuccess={handleSuccess}
        locale={locale}
        categories={categories}
        cities={cities}
        hasIdnp={hasIdnp}
      />
    </div>
  );
}
