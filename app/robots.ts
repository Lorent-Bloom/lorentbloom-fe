import type { MetadataRoute } from "next";
import { BRAND } from "@shared/config/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/*/account/",
          "/*/cart",
          "/*/checkout",
          "/*/checkout/",
          "/*/wishlist",
          "/*/sign-contract/",
          "/*/product-search",
        ],
      },
    ],
    sitemap: `${BRAND.domain}/sitemap.xml`,
  };
}
