import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { LanguageSelector } from "@features/change-language";
import { ThemeToggle } from "@features/theme-toggle";
import { UserAvatar } from "@features/user-avatar";
import { CartMenu } from "@widgets/cart-menu";
import { WishlistIcon } from "@features/wishlist-icon";
import { ChatIcon } from "@features/chat-icon";
import { HeaderSearch } from "@widgets/header-search";
import { getCustomer } from "@entities/customer";
import { getCategoryTree } from "@entities/category";
import CategoryNavBar from "./CategoryNavBar";

const Header = async () => {
  const locale = await getLocale();
  const t = await getTranslations("header");
  const customer = await getCustomer();
  const isAuthenticated = !!customer;

  // Fetch category tree for navigation
  const categoryResult = await getCategoryTree();
  const categories =
    categoryResult.success && categoryResult.data ? categoryResult.data : [];

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Main Header */}
      <div className="border-b border-border/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-14 items-center gap-4">
            {/* Left: Logo */}
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 shrink-0"
            >
              <Image
                src="/logo.png"
                alt={t("logoAlt")}
                width={36}
                height={36}
                className="object-contain rounded-4xl"
                priority
              />
              <span className="text-xl font-bold tracking-tight hidden sm:inline">
                {t("brandName")}
              </span>
            </Link>

            {/* Search - Desktop (compact, expandable) */}
            <div className="hidden lg:block flex-1 max-w-xl">
              <HeaderSearch locale={locale} />
            </div>

            {/* Spacer - pushes actions to the right */}
            <div className="flex-1" />

            {/* Right: Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <LanguageSelector />
              <ThemeToggle />
              <div className="h-6 w-px bg-border" />

              {isAuthenticated ? (
                <>
                  <div className="hidden sm:block">
                    <WishlistIcon />
                  </div>
                  {/* Cart - hidden on mobile (shown in CategoryNavBar dropdown instead) */}
                  <div className="hidden lg:block">
                    <CartMenu />
                  </div>
                  {/* Chat - next to user avatar */}
                  <div className="hidden lg:block">
                    <ChatIcon />
                  </div>
                </>
              ) : null}

              <UserAvatar />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden border-b border-border/40 py-2 px-4">
        <HeaderSearch locale={locale} />
      </div>

      {/* Category Navigation - Desktop: pills, Mobile: dropdown accordion */}
      <CategoryNavBar
        locale={locale}
        categories={categories}
        isAuthenticated={isAuthenticated}
      />
    </header>
  );
};

export default Header;
