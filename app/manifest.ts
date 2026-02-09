import type { MetadataRoute } from "next";
import { BRAND } from "@shared/config/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: "Lorent Bloom",
    description:
      "Rental marketplace in Moldova - rent electronics, tools, and equipment in Chișinău",
    start_url: "/en",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0d9488",
    icons: [
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
