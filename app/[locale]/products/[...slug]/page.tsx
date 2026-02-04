import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getCommonMetadata } from "@shared/lib/seo";
import { getProducts, type ProductFilterInput } from "@entities/product";
import { getCategoryTree } from "@entities/category";
import { ProductsPage } from "@views/products";
import { ProductGridSkeleton } from "@widgets/product-grid";
import { getSortVariables, parseSortOption } from "@features/product-sort";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  const common = getCommonMetadata(locale, `products/${slug.join("/")}`);

  return {
    title: t("metadata.categoryTitle"),
    description: t("metadata.categoryDescription"),
    ...common,
  };
}

interface CategoryRouteProps {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
  searchParams: Promise<{
    search?: string;
    sort?: string;
    page?: string;
    pageSize?: string;
    // Dynamic filter attributes (color, size, manufacturer, price, etc.)
    [key: string]: string | undefined;
  }>;
}

async function CategoryContent({ params, searchParams }: CategoryRouteProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { slug } = resolvedParams;
  const { search, sort, page, pageSize } = resolvedSearchParams;

  // The route is now at /products/[...slug]
  // slug contains: ["women"] or ["women", "tops"] or ["women", "tops", "jackets"]
  // Get the last segment (the actual category we're filtering by)
  const categoryUrlKey = slug[slug.length - 1];

  // Fetch categories to find the matching category UID
  const categoryResult = await getCategoryTree();
  const categories = categoryResult.data ?? [];

  // Find category by url_key (recursive search through category tree)
  const findCategoryByUrlKey = (
    cats: typeof categories,
    urlKey: string,
  ): (typeof categories)[0] | null => {
    if (!cats) return null;
    for (const cat of cats) {
      if (cat.url_key === urlKey) {
        return cat;
      }
      if (cat.children && cat.children.length > 0) {
        const found = findCategoryByUrlKey(cat.children, urlKey);
        if (found) return found;
      }
    }
    return null;
  };

  // Collect all category UIDs (parent + all descendants) for filtering
  const collectCategoryUids = (category: (typeof categories)[0]): string[] => {
    const uids = [category.uid];
    if (category.children && category.children.length > 0) {
      for (const child of category.children) {
        uids.push(...collectCategoryUids(child));
      }
    }
    return uids;
  };

  const category = findCategoryByUrlKey(categories, categoryUrlKey);
  const categoryUids = category ? collectCategoryUids(category) : null;

  const currentPage = page ? parseInt(page, 10) : 1;
  const sortOption = parseSortOption(sort || "");
  const sortVariables = getSortVariables(sortOption);

  // Build filter object - supports dynamic attributes
  const filter: ProductFilterInput = {};

  // Known filter parameters to exclude from dynamic processing
  const knownParams = new Set(["search", "sort", "page", "pageSize", "locale"]);

  // Search filter
  if (search) {
    filter.name = { match: search };
  }

  // Category filter - include all subcategories and sub-subcategories
  if (categoryUids && categoryUids.length > 0) {
    filter.category_uid = { in: categoryUids };
  }

  // Dynamic attribute filters (color, size, manufacturer, price, etc.)
  // Format: ?color=red,blue&size=small&price=20_30,50_100
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (!knownParams.has(key) && value) {
      const values = value.split(",").filter(Boolean);
      if (values.length > 0) {
        // Special handling for price aggregations
        // Price values come as "20_30" meaning $20-$30 range
        if (key === "price") {
          // For price, we need to create OR conditions for each range
          const priceRanges = values.map((range) => {
            const [from, to] = range.split("_");
            return { from, to };
          });
          // If multiple ranges, use the widest range (min of froms, max of tos)
          if (priceRanges.length === 1) {
            filter.price = priceRanges[0];
          } else {
            const allFroms = priceRanges.map((r) => parseFloat(r.from));
            const allTos = priceRanges.map((r) => parseFloat(r.to));
            filter.price = {
              from: Math.min(...allFroms).toString(),
              to: Math.max(...allTos).toString(),
            };
          }
        } else {
          // For other attributes, use 'in' for multiple values, 'eq' for single
          filter[key] = values.length > 1 ? { in: values } : { eq: values[0] };
        }
      }
    }
  });

  const result = await getProducts({
    search,
    filter: Object.keys(filter).length > 0 ? filter : undefined,
    sort: sortVariables,
    pageSize: pageSize ? parseInt(pageSize, 10) : 12,
    currentPage,
  });

  return (
    <ProductsPage
      data={result.data}
      error={result.error}
      searchParams={resolvedSearchParams}
    />
  );
}

export default function CategoryRoute(props: CategoryRouteProps) {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-6">
            <div className="h-9 w-48 animate-pulse rounded-md bg-muted" />
            <div className="mt-1 h-4 w-64 animate-pulse rounded-md bg-muted" />
          </div>

          {/* Search + Sort Skeleton */}
          <div className="mb-6 flex items-center gap-4">
            <div className="h-10 flex-1 animate-pulse rounded-md bg-muted" />
            <div className="h-10 w-[180px] animate-pulse rounded-md bg-muted" />
          </div>

          {/* Main Content: Filters + Products */}
          <div className="flex gap-6">
            {/* Filters Sidebar Skeleton - Desktop only */}
            <aside className="hidden w-72 shrink-0 lg:block">
              <div className="animate-pulse rounded-lg border p-4">
                <div className="mb-3 h-5 w-20 rounded bg-muted" />
                <div className="space-y-3">
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="h-3 w-16 rounded bg-muted" />
                      <div className="h-9 w-full rounded bg-muted" />
                    </div>
                    <div className="space-y-1">
                      <div className="h-3 w-16 rounded bg-muted" />
                      <div className="h-9 w-full rounded bg-muted" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 flex-1 rounded bg-muted" />
                    <div className="h-8 w-10 rounded bg-muted" />
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Section */}
            <div className="flex-1 min-w-0">
              {/* Mobile Filters Button Skeleton */}
              <div className="mb-4 lg:hidden">
                <div className="h-9 w-28 animate-pulse rounded-md bg-muted" />
              </div>

              {/* Products Grid Skeleton */}
              <ProductGridSkeleton />
            </div>
          </div>
        </div>
      }
    >
      <CategoryContent {...props} />
    </Suspense>
  );
}
