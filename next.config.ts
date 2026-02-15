import type { NextConfig } from "next";
import "@shared/config/env";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const isDev = process.env.NODE_ENV === "development";

// Disable TLS certificate validation for development (mkcert self-signed certs)
// This must be set before any network requests, including image optimization
if (isDev) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  cacheComponents: false, // Disabled - project has many dynamic auth-based routes
  experimental: {
    turbopackFileSystemCacheForDev: true,
    serverActions: {
      bodySizeLimit: "10mb", // Increased from default 1MB to handle base64 image uploads
    },
  },
  images: {
    // Disable optimization in dev (devapi.rently.com resolves to 127.0.0.1, blocked by SSRF protection)
    unoptimized: isDev,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "devapi.rently.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.lorentbloom.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.lorentbloom.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

const withNextIntl = createNextIntlPlugin(
  "./src/shared/config/i18n/lib/request.ts",
);

export default withSentryConfig(withNextIntl(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  telemetry: false,
});
