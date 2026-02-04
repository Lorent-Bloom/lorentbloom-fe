"use client";

import { Star, Package, Layers, BadgeCheck, ShoppingCart, Users } from "lucide-react";
import { cn } from "@shared/lib/utils/helpers";
import { useTestimonials } from "../lib/useTestimonials";
import type { TestimonialsProps } from "../model/interface";

const statIcons = [Package, Layers, ShoppingCart, Users];

export default function Testimonials({ className, stats: statsData, reviews }: TestimonialsProps) {
  const { title, subtitle, testimonials, stats, statsTitle, badge } =
    useTestimonials(statsData, reviews);

  return (
    <section className={cn("py-20 bg-background relative", className)}>
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Stats Section */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {statsTitle}
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
            {stats.map((stat, index) => {
              const Icon = statIcons[index % statIcons.length];
              return (
                <div
                  key={index}
                  className="group relative p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10 text-center hover:border-primary/20 transition-colors w-full sm:w-64"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium mb-6">
            <BadgeCheck className="h-4 w-4" />
            <span>{badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        </div>

        {/* Testimonials Grid - 2 rows of 3 */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group relative p-6 lg:p-8 rounded-2xl bg-card border hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
            >
              {/* Verified Badge */}
              <div className="absolute top-6 right-6 flex items-center gap-1 text-green-600 dark:text-green-400">
                <BadgeCheck className="w-4 h-4" />
                <span className="text-xs font-medium">Verified</span>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-500 text-yellow-500"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground leading-relaxed mb-6 relative z-10">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-lg font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
