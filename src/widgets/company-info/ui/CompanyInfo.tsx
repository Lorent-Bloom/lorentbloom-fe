"use client";

import {
  Shield,
  Clock,
  Award,
  HeartHandshake,
  TrendingUp,
  Users,
  Package,
  Star,
} from "lucide-react";
import { cn } from "@shared/lib/utils/helpers";
import { useCompanyInfo } from "../lib/useCompanyInfo";
import type { CompanyInfoProps } from "../model/interface";

const icons = [Shield, Clock, Award, HeartHandshake];

export default function CompanyInfo({ className }: CompanyInfoProps) {
  const {
    aboutTitle,
    aboutDescription,
    missionTitle,
    missionDescription,
    valuesTitle,
    stats,
    featuresTitle,
    features,
  } = useCompanyInfo();

  return (
    <div className={cn("w-full", className)}>
      {/* About Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {aboutTitle}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {aboutDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const StatIcon =
                [TrendingUp, Users, Package, Star][index] || Star;
              return (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <StatIcon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">
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
      </section>

      {/* Mission & Values Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Mission */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {missionTitle}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {missionDescription}
              </p>
            </div>

            {/* Values */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {valuesTitle}
              </h3>
              <ul className="space-y-3">
                {features.slice(0, 4).map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <div className="mt-1 p-1 bg-primary/10 rounded">
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                    <span>{feature.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {featuresTitle}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const FeatureIcon = icons[index] || Shield;
              return (
                <div
                  key={index}
                  className="text-center p-6 bg-background rounded-lg border hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary/10 rounded-full">
                      <FeatureIcon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
