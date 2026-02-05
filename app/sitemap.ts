import type { MetadataRoute } from "next";
import { gql } from "@apollo/client";
import { getPublicClient } from "@shared/api";
import { getCategoryTree } from "@entities/category";
import { BRAND } from "@shared/config/brand";

const DOMAIN = BRAND.domain;
const LOCALES = ["en", "ru", "ro"];

const STATIC_PAGES = [
  { path: "", changeFrequency: "daily" as const, priority: 1.0 },
  { path: "about", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "faq", changeFrequency: "monthly" as const, priority: 0.6 },
  { path: "contact-us", changeFrequency: "monthly" as const, priority: 0.6 },
  {
    path: "how-to-rent-out",
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    path: "terms-of-policy",
    changeFrequency: "yearly" as const,
    priority: 0.3,
  },
  { path: "sign-in", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "sign-up", changeFrequency: "yearly" as const, priority: 0.3 },
];

const GET_ALL_PRODUCT_URLS = gql`
  query GetAllProductUrls($pageSize: Int, $currentPage: Int) {
    products(filter: {}, pageSize: $pageSize, currentPage: $currentPage) {
      items {
        url_key
      }
      total_count
    }
  }
`;

interface CategoryNode {
  url_key: string;
  children?: CategoryNode[];
}

function collectCategoryPaths(
  categories: CategoryNode[],
  parentPath: string = "",
): string[] {
  const paths: string[] = [];
  for (const cat of categories) {
    if (!cat.url_key) continue;
    const currentPath = parentPath
      ? `${parentPath}/${cat.url_key}`
      : cat.url_key;
    paths.push(currentPath);
    if (cat.children && cat.children.length > 0) {
      paths.push(...collectCategoryPaths(cat.children, currentPath));
    }
  }
  return paths;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  for (const page of STATIC_PAGES) {
    for (const locale of LOCALES) {
      const url = page.path
        ? `${DOMAIN}/${locale}/${page.path}`
        : `${DOMAIN}/${locale}`;

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [
              l,
              page.path ? `${DOMAIN}/${l}/${page.path}` : `${DOMAIN}/${l}`,
            ]),
          ),
        },
      });
    }
  }

  // Category pages
  try {
    const categoryResult = await getCategoryTree();
    if (categoryResult.success && categoryResult.data) {
      const categoryPaths = collectCategoryPaths(
        categoryResult.data as CategoryNode[],
      );
      for (const catPath of categoryPaths) {
        for (const locale of LOCALES) {
          entries.push({
            url: `${DOMAIN}/${locale}/products/${catPath}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
            alternates: {
              languages: Object.fromEntries(
                LOCALES.map((l) => [l, `${DOMAIN}/${l}/products/${catPath}`]),
              ),
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("Sitemap: Error fetching categories:", error);
  }

  // Product detail pages
  try {
    const { data } = await getPublicClient().query<{
      products: { items: { url_key: string }[]; total_count: number };
    }>({
      query: GET_ALL_PRODUCT_URLS,
      variables: { pageSize: 1000, currentPage: 1 },
      context: {
        fetchOptions: {
          next: { revalidate: 3600 },
        },
      },
    });

    if (data?.products?.items) {
      for (const product of data.products.items) {
        for (const locale of LOCALES) {
          entries.push({
            url: `${DOMAIN}/${locale}/products/p/${product.url_key}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
            alternates: {
              languages: Object.fromEntries(
                LOCALES.map((l) => [
                  l,
                  `${DOMAIN}/${l}/products/p/${product.url_key}`,
                ]),
              ),
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("Sitemap: Error fetching products:", error);
  }

  return entries;
}
