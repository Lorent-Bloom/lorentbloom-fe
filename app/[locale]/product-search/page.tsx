import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCommonMetadata } from "@shared/lib/seo";
import { getProducts, type ProductFilterInput } from "@entities/product";
import { getCategoryTree } from "@entities/category";
import { SearchPage } from "@views/search";
import { ProductGridSkeleton } from "@widgets/product-grid";
import { getSortVariables, parseSortOption } from "@features/product-sort";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "search" });
  const common = getCommonMetadata(locale, "product-search", {
    noIndex: true,
  });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    ...common,
  };
}

interface SearchRouteProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    q?: string;
    sort?: string;
    page?: string;
    pageSize?: string;
    // Dynamic filter attributes (color, size, manufacturer, price, etc.)
    [key: string]: string | undefined;
  }>;
}

async function SearchContent({ params, searchParams }: SearchRouteProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { q, sort, page, pageSize } = resolvedSearchParams;

  // Validate search query - redirect to home if empty
  if (!q || q.trim().length === 0) {
    redirect(`/${resolvedParams.locale}`);
  }

  // Fetch category tree (cached for 1 hour)
  const categoryResult = await getCategoryTree();
  const categories = categoryResult.data ?? [];

  const currentPage = page ? parseInt(page, 10) : 1;
  const sortOption = parseSortOption(sort || "");
  const sortVariables = getSortVariables(sortOption);

  // Build filter object - supports dynamic attributes
  const filter: ProductFilterInput = {};

  // Known filter parameters to exclude from dynamic processing
  const knownParams = new Set(["q", "sort", "page", "pageSize", "locale"]);

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

  // Fetch products with search query and filters
  const productsResult = await getProducts({
    search: q,
    filter: Object.keys(filter).length > 0 ? filter : undefined,
    sort: sortVariables,
    pageSize: pageSize ? parseInt(pageSize, 10) : 12,
    currentPage,
  });

  return (
    <SearchPage
      searchQuery={q}
      categoriesData={categories}
      productsData={productsResult.data}
      productsError={productsResult.error ?? undefined}
      searchParams={resolvedSearchParams}
      locale={resolvedParams.locale}
    />
  );
}

function SearchPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-10 w-96 bg-muted animate-pulse rounded mb-2" />
        <div className="h-4 w-64 bg-muted animate-pulse rounded" />
      </div>
      <ProductGridSkeleton />
    </div>
  );
}

export default function SearchRoute(props: SearchRouteProps) {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchContent {...props} />
    </Suspense>
  );
}
