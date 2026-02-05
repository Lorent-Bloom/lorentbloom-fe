"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { Separator } from "@shared/ui/separator";
import { useFooter } from "../lib/useFooter";
import { BRAND } from "@shared/config/brand";

const Footer = () => {
  const { t, locale, currentYear, footerLinks } = useFooter();

  return (
    <footer className="bg-muted/40 dark:bg-muted/20">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={`/${locale}`} className="inline-flex items-center mb-4">
              <Image
                src="/logo.png"
                alt={BRAND.name}
                width={48}
                height={48}
                className="object-contain rounded-4xl"
              />
              <span className="ml-2 text-xl font-bold">{BRAND.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">
              {t("brand.tagline")}
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href={`mailto:${t("contact.email")}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>{t("contact.email")}</span>
              </a>
            </div>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              {t("sections.help")}
            </h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              {t("sections.information")}
            </h3>
            <ul className="space-y-3">
              {footerLinks.information.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Bar */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex justify-center">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            {t("copyright", { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
