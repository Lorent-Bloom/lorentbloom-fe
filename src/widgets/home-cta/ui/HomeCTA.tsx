"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@shared/lib/utils/helpers";
import type { HomeCTAProps } from "../model/interface";

export default function HomeCTA({ className }: HomeCTAProps) {
  const t = useTranslations("home-cta");

  const features = [
    t("features.0"),
    t("features.1"),
    t("features.2"),
    t("features.3"),
  ];

  return (
    <section className={cn("py-20 relative overflow-hidden", className)}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
            {t("title")}
          </h2>

          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            {t("subtitle")}
          </p>

          {/* Features */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-primary-foreground/90"
              >
                <div className="w-5 h-5 rounded-full bg-[#43c8aa] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm sm:text-base">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
