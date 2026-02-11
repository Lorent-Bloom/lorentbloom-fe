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
import Script from "next/script";
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
                'personalization_storage': 'denied'
              });
            `,
          }}
        />
        {env.NEXT_PUBLIC_GTM_ID &&
          process.env.VERCEL_ENV === "production" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${env.NEXT_PUBLIC_GTM_ID}');`,
            }}
          />
        )}
        <JsonLd data={getOrganizationJsonLd()} />
        <JsonLd data={getWebSiteJsonLd(locale)} />
      </head>
      <body className="flex flex-col min-h-screen">
        {env.NEXT_PUBLIC_GTM_ID &&
          process.env.VERCEL_ENV === "production" && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {env.NEXT_PUBLIC_GA_MEASUREMENT_ID &&
          process.env.VERCEL_ENV === "production" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="lazyOnload"
            />
            <Script id="ga-config" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
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
