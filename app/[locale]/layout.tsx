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
import { RecaptchaScript } from "@shared/lib/recaptcha";
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
    en: `${BRAND.name} - Rental marketplace in Moldova. Rent electronics, tools, equipment and more in Chișinău. Affordable peer-to-peer rentals.`,
    ru: `${BRAND.name} - Маркетплейс аренды в Молдове. Арендуйте электронику, инструменты, оборудование и многое другое в Кишинёве. Доступная аренда вещей.`,
    ro: `${BRAND.name} - Piața de închiriere în Moldova. Închiriază electronice, unelte, echipamente și altele în Chișinău. Închirieri accesibile între persoane.`,
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
        <JsonLd data={getOrganizationJsonLd()} />
        <JsonLd data={getWebSiteJsonLd(locale)} />
      </head>
      <body className="flex flex-col min-h-screen">
        {env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-config" strategy="afterInteractive">
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
              <RecaptchaScript />
            </ApolloProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
