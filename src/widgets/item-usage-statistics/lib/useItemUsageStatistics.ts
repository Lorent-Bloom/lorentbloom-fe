"use client";

import { useTranslations } from "next-intl";
import type { UsageSegment } from "../model/interface";

export const useItemUsageStatistics = () => {
  const t = useTranslations("item-usage-statistics");

  const segments: UsageSegment[] = [
    {
      id: "regular",
      label: t("segments.regular"),
      value: 20,
      color: "#22c55e", // green-500
    },
    {
      id: "rarely",
      label: t("segments.rarely"),
      value: 30,
      color: "#f59e0b", // amber-500
    },
    {
      id: "dust",
      label: t("segments.dust"),
      value: 50,
      color: "#ef4444", // red-500
    },
  ];

  // Calculate stroke-dasharray values for SVG donut chart
  const circumference = 2 * Math.PI * 45; // radius = 45
  let cumulativePercent = 0;

  const chartSegments = segments.map((segment) => {
    const strokeDasharray = `${(segment.value / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativePercent * circumference;
    cumulativePercent += segment.value / 100;

    return {
      ...segment,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return {
    title: t("title"),
    subtitle: t("subtitle"),
    chartTitle: t("chartTitle"),
    segments: chartSegments,
    highlightStat: t("highlightStat"),
    highlightDescription: t("highlightDescription"),
  };
};
