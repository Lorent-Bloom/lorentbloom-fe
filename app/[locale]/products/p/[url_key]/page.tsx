import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCommonMetadata } from "@shared/lib/seo";

import { ProductDetailPage } from "@views/product-detail";
import { getProductDetail, getProducts } from "@entities/product";
import { routing } from "@shared/config/i18n";

// Force dynamic rendering to bypass cache
export const dynamic = "force-dynamic";

// Generate static params for all locale/product combinations
export async function generateStaticParams() {
  const locales = routing.locales;
  const params: Array<{ locale: string; url_key: string }> = [];

  try {
    // Fetch a reasonable number of products to pre-generate
    // In production, you might want to limit this or fetch from a specific category
    const productsResult = await getProducts({ pageSize: 100 });

    if (productsResult.success && productsResult.data) {
      for (const locale of locales) {
        for (const product of productsResult.data.items) {
          params.push({
            locale,
            url_key: product.url_key,
          });
        }
      }
    }
  } catch {
    // If API is unavailable during build, return minimal params
    // The pages will be generated on-demand at runtime
  }

  // Always return at least one param to satisfy Next.js Cache Components requirement
  if (params.length === 0) {
    return locales.map((locale) => ({ locale, url_key: "placeholder" }));
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; url_key: string }>;
}): Promise<Metadata> {
  const { locale, url_key } = await params;
  const t = await getTranslations({ locale, namespace: "product-detail" });
  const common = getCommonMetadata(locale, `products/p/${url_key}`);

  const result = await getProductDetail(url_key);

  if (!result.success || !result.data) {
    return {
      title: t("metadata.productNotFound"),
    };
  }

  const product = result.data;
  const description =
    product.meta_description ||
    product.short_description?.html.replace(/<[^>]*>/g, "").slice(0, 160) ||
    `${t("metadata.buyProductPrefix")}${product.name} on Lorent Bloom`;

  return {
    title: product.name,
    description,
    keywords: product.meta_keyword || undefined,
    ...common,
    openGraph: {
      ...common.openGraph,
      title: product.name,
      description,
      images: product.image
        ? [
            {
              url: product.image.url,
              alt: product.image.label || product.name,
            },
          ]
        : [],
    },
  };
}

interface PageProps {
  params: Promise<{
    locale: string;
    url_key: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { url_key } = await params;

  const result = await getProductDetail(url_key);

  if (!result.success || !result.data) {
    // Log error for debugging
    console.error("Product not found:", url_key, result.error);
    notFound();
  }

  return <ProductDetailPage product={result.data} />;
}
