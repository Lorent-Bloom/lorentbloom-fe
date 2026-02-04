"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@shared/lib/utils/helpers";
import { useItemUsageStatistics } from "../lib/useItemUsageStatistics";
import type { ItemUsageStatisticsProps } from "../model/interface";

export default function ItemUsageStatistics({
  className,
}: ItemUsageStatisticsProps) {
  const {
    title,
    subtitle,
    chartTitle,
    segments,
    highlightStat,
    highlightDescription,
  } = useItemUsageStatistics();

  return (
    <section className={cn("py-24 relative overflow-hidden", className)}>
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />

      {/* Animated red glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 text-sm font-medium mb-6 border border-red-500/30">
            <AlertTriangle className="h-4 w-4" />
            <span>{chartTitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            {title}
          </h2>
          <p className="text-lg sm:text-xl text-slate-300">{subtitle}</p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Chart Side */}
            <div className="flex flex-col items-center order-2 lg:order-1">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 blur-xl animate-pulse" />

                {/* Chart container */}
                <div className="relative w-full h-full">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full -rotate-90 transform drop-shadow-2xl"
                  >
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="8"
                    />
                    {/* Chart segments */}
                    {segments.map((segment) => (
                      <circle
                        key={segment.id}
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={segment.color}
                        strokeWidth="8"
                        strokeDasharray={segment.strokeDasharray}
                        strokeDashoffset={segment.strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                        style={{
                          filter:
                            segment.id === "dust"
                              ? "drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))"
                              : "none",
                        }}
                      />
                    ))}
                  </svg>

                  {/* Center content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl sm:text-7xl font-black text-white drop-shadow-lg">
                      80%
                    </span>
                    <span className="text-sm sm:text-base text-slate-400 font-medium mt-1">
                      {highlightDescription}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Side */}
            <div className="space-y-5 order-1 lg:order-2">
              {segments.map((segment) => {
                const isDust = segment.id === "dust";
                return (
                  <div
                    key={segment.id}
                    className={cn(
                      "relative p-5 rounded-2xl border transition-all duration-300 group",
                      isDust
                        ? "bg-gradient-to-r from-red-500/20 to-red-600/10 border-red-500/40 hover:border-red-500/60 shadow-lg shadow-red-500/10"
                        : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                    )}
                  >
                    {/* Glow effect for dust segment */}
                    {isDust && (
                      <div className="absolute inset-0 rounded-2xl bg-red-500/5 blur-xl -z-10" />
                    )}

                    <div className="flex items-center gap-4">
                      {/* Color indicator */}
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full flex-shrink-0 ring-2 ring-offset-2 ring-offset-slate-900",
                          isDust ? "ring-red-500/50" : "ring-transparent"
                        )}
                        style={{ backgroundColor: segment.color }}
                      />

                      {/* Label */}
                      <div className="flex-1">
                        <p
                          className={cn(
                            "font-semibold text-lg",
                            isDust ? "text-red-400" : "text-white"
                          )}
                        >
                          {segment.label}
                        </p>
                      </div>

                      {/* Percentage */}
                      <div
                        className={cn(
                          "text-3xl sm:text-4xl font-black",
                          isDust ? "text-red-400" : "text-white"
                        )}
                      >
                        {segment.value}%
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Highlight callout */}
              <div className="relative mt-8 p-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 shadow-2xl shadow-red-500/30">
                {/* Animated border glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-400 to-orange-400 rounded-2xl blur opacity-30 animate-pulse" />

                <div className="relative flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-white font-bold text-lg sm:text-xl leading-tight">
                    {highlightStat}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
