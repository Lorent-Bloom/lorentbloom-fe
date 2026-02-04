import type { MetadataRoute } from "next";

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
    sitemap: "https://minimum.md/sitemap.xml",
  };
}
