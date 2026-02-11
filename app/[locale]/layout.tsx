import { Metadata } from "next";
import "@next/globals.css";
import React from "react";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";
import { DynamicBreadcrumb } from "@/widgets/breadcrumb";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@shared/config/i18n";
import { ApolloProvider, ThemeProvider } from "@/app";
import { GoogleTagManager } from "@next/third-parties/google";
import { env } from "@shared/config/env";
import { CookieConsentBanner } from "@/widgets/cookie-consent";
import { Toaster } from "@shared/ui";
import { AuthCheck } from "@shared/lib/hooks/AuthCheck";
import { cookies } from "next/headers";
import { TOKEN_COOKIE_NAME } from "@shared/api";
import { BRAND } from "@shared/config/brand";
import {
  JsonLd,
  getOrganizationJsonLd,
  getWebSiteJsonLd,
} from "@shared/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const descriptions: Record<string, string> = {
    en: `${BRAND.name} — Rental marketplace in Moldova. Rent electronics, tools and equipment in Chișinău at affordable prices.`,
    ru: `${BRAND.name} — Маркетплейс аренды в Молдове. Арендуйте электронику, инструменты и оборудование в Кишинёве.`,
    ro: `${BRAND.name} — Piața de închiriere în Moldova. Închiriază electronice, unelte și echipamente în Chișinău.`,
  };

  const description = descriptions[locale] || descriptions.en;

  return {
    metadataBase: new URL(BRAND.domain),
    title: {
      default: BRAND.name,
      template: `%s | ${BRAND.name}`,
    },
    description,
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon.png", type: "image/png", sizes: "32x32" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    },
    openGraph: {
      siteName: BRAND.name,
      type: "website",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: BRAND.name,
      description,
    },
    alternates: {
      canonical: `${BRAND.domain}/${locale}`,
      languages: {
        en: `${BRAND.domain}/en`,
        ru: `${BRAND.domain}/ru`,
        ro: `${BRAND.domain}/ro`,
        "x-default": `${BRAND.domain}/en`,
      },
    },
    other: {
      "theme-color": "#ffffff",
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const cookieStore = await cookies();
  const hasToken = Boolean(cookieStore.get(TOKEN_COOKIE_NAME)?.value);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'functionality_storage': 'granted',
                'security_storage': 'granted',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'personalization_storage': 'denied',
                'wait_for_update': 500
              });
            `,
          }}
        />
        <JsonLd data={getOrganizationJsonLd()} />
        <JsonLd data={getWebSiteJsonLd(locale)} />
      </head>
      <body className="flex flex-col min-h-screen">
        {env.NEXT_PUBLIC_GTM_ID && process.env.VERCEL_ENV === "production" && (
          <GoogleTagManager gtmId={env.NEXT_PUBLIC_GTM_ID} />
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <ApolloProvider>
              <AuthCheck locale={locale} hasToken={hasToken} />
              <Header />
              <DynamicBreadcrumb />
              <main className="flex flex-col grow">{children}</main>
              <Footer />
              <Toaster />
              <CookieConsentBanner />
            </ApolloProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
