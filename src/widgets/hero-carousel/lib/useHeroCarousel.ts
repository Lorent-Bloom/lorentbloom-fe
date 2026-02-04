"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { Slide } from "../model/interface";

export const useHeroCarousel = () => {
  const t = useTranslations("hero-carousel");
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Define slides with translations
  const slides: Slide[] = [
    {
      id: "1",
      title: t("slides.0.title"),
      description: t("slides.0.description"),
      image: "https://placehold.co/1920x600/0066cc/ffffff?text=Slide+1",
      cta: {
        text: t("slides.0.cta"),
        href: "/products",
      },
    },
    {
      id: "2",
      title: t("slides.1.title"),
      description: t("slides.1.description"),
      image: "https://placehold.co/1920x600/00cc66/ffffff?text=Slide+2",
      cta: {
        text: t("slides.1.cta"),
        href: "/products",
      },
    },
    {
      id: "3",
      title: t("slides.2.title"),
      description: t("slides.2.description"),
      image: "https://placehold.co/1920x600/cc6600/ffffff?text=Slide+3",
      cta: {
        text: t("slides.2.cta"),
        href: "/products",
      },
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const previousSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const handleCTAClick = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router],
  );

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [nextSlide]);

  return {
    slides,
    currentSlide,
    nextSlide,
    previousSlide,
    goToSlide,
    handleCTAClick,
  };
};
