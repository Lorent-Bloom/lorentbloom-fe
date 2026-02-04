"use client";

import { Search, Calendar, Package } from "lucide-react";
import { cn } from "@shared/lib/utils/helpers";
import { useHowItWorks } from "../lib/useHowItWorks";
import type { HowItWorksProps } from "../model/interface";

const stepIcons = [Search, Calendar, Package];

export default function HowItWorks({ className }: HowItWorksProps) {
  const { title, subtitle, steps } = useHowItWorks();

  return (
    <section className={cn("py-20 bg-background relative", className)}>
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = stepIcons[index];
            const isLast = index === steps.length - 1;

            return (
              <div key={step.number} className="relative">
                {/* Connector Line (hidden on mobile and last item) */}
                {!isLast && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+60px)] w-[calc(100%-60px)] h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
                )}

                <div className="flex flex-col items-center text-center group">
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Icon Box */}
                    <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center group-hover:scale-105 group-hover:border-primary/40 transition-all duration-300">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>

                    {/* Step Number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
