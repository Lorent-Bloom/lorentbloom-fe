"use client";

import { Clock, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@shared/lib/utils/helpers";
import { useRentalInfo } from "../lib/useRentalInfo";
import type { RentalInfoProps } from "../model/interface";

const featureIcons = [Clock, Zap, ShieldCheck];

export default function RentalInfo({ className }: RentalInfoProps) {
  const { badge, title, subtitle, features } = useRentalInfo();

  return (
    <section className={cn("py-20 bg-muted/30 relative overflow-hidden", className)}>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Clock className="h-4 w-4" />
            <span>{badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 tracking-tight">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = featureIcons[index];
            return (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-background border border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="mb-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
