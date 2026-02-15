"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { driver } from "driver.js";
import { useOnboardingStore } from "./useOnboardingStore";
import { tours, DYNAMIC_PAGES } from "../model/tours";
import type { TourStep } from "../model/tours";

// next-intl requires literal keys for type safety.
// Tour keys are dynamic, so we use a helper to bypass the type check.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyKey = any;

/**
 * Resolve a dynamic page value to a real path by reading the DOM.
 * Returns the path without locale prefix (e.g. "/products/electronics").
 */
function resolveDynamicPage(page: string, locale: string): string | null {
  if (page === DYNAMIC_PAGES.RANDOM_CATEGORY) {
    const links = document.querySelectorAll('[data-tour="category-nav"] a');
    if (links.length > 0) {
      const randomLink = links[Math.floor(Math.random() * links.length)];
      const href = randomLink.getAttribute("href");
      if (href) {
        return href.replace(`/${locale}`, "");
      }
    }
    return null;
  }
  return page;
}

/** Check if a current page path matches a step's page value */
function isPageMatch(stepPage: string, currentPath: string): boolean {
  if (stepPage === DYNAMIC_PAGES.RANDOM_CATEGORY) {
    return currentPath.startsWith("/products/");
  }
  return stepPage === currentPath;
}

export const useTourDriver = (locale: string) => {
  const {
    activeTour,
    activeTourStep,
    endTour,
  } = useOnboardingStore();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("onboarding");
  const driverRef = useRef<ReturnType<typeof driver> | null>(null);
  const hasStartedRef = useRef(false);

  const currentPagePath = pathname.replace(`/${locale}`, "");

  const runTour = useCallback(() => {
    if (!activeTour) return;

    const tourDef = tours[activeTour];
    if (!tourDef) return;

    const allSteps = tourDef.steps;
    const currentStepIndex = activeTourStep;

    if (currentStepIndex >= allSteps.length) {
      endTour();
      return;
    }

    const currentStep = allSteps[currentStepIndex];

    // If current step is on a different page, navigate there
    if (!isPageMatch(currentStep.page, currentPagePath)) {
      const resolvedPage = resolveDynamicPage(currentStep.page, locale);
      if (!resolvedPage) return; // Could not resolve (e.g. no categories loaded)
      router.push(`/${locale}${resolvedPage}`);
      return;
    }

    // Collect consecutive steps on the current page starting from activeTourStep.
    // Stop before any step that has a trigger (unless it's the first step in the batch).
    const stepsForThisPage: { step: TourStep; globalIndex: number }[] = [];
    for (let i = currentStepIndex; i < allSteps.length; i++) {
      if (!isPageMatch(allSteps[i].page, currentPagePath)) break;
      // If this step has a trigger and it's NOT the first step in the batch,
      // stop here — let the trigger step start a new batch next time.
      if (allSteps[i].trigger && stepsForThisPage.length > 0) break;
      stepsForThisPage.push({ step: allSteps[i], globalIndex: i });
    }

    if (stepsForThisPage.length === 0) return;

    // Check if the first step has a trigger (e.g. needs to open a dialog first)
    const firstStep = stepsForThisPage[0].step;
    if (firstStep.trigger) {
      const triggerEl = document.querySelector(firstStep.trigger) as HTMLElement;
      if (triggerEl) {
        // Destroy any existing driver
        if (driverRef.current) {
          driverRef.current.destroy();
        }
        // Click the trigger element (e.g. "Add Product" button to open dialog)
        triggerEl.click();
        // Wait for the dialog/UI to render, then start driver with these steps
        setTimeout(() => {
          startDriver(stepsForThisPage, allSteps);
        }, 600);
        return;
      }
    }

    startDriver(stepsForThisPage, allSteps);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTour, activeTourStep, currentPagePath, locale, router, t, endTour]);

  const startDriver = useCallback((
    stepsForThisPage: { step: TourStep; globalIndex: number }[],
    allSteps: TourStep[],
  ) => {
    const isLastPageOfTour =
      stepsForThisPage[stepsForThisPage.length - 1].globalIndex ===
      allSteps.length - 1;

    const driverSteps = stepsForThisPage.map(({ step }, idx) => ({
      element: step.element || undefined,
      popover: {
        title: t(`${step.i18nKey}.title` as AnyKey),
        description: t(`${step.i18nKey}.description` as AnyKey),
        nextBtnText:
          idx === stepsForThisPage.length - 1 && !isLastPageOfTour
            ? t("tours.nextPage" as AnyKey)
            : undefined,
      },
    }));

    // Destroy previous driver instance
    if (driverRef.current) {
      driverRef.current.destroy();
    }

    const lastGlobalIdx =
      stepsForThisPage[stepsForThisPage.length - 1].globalIndex;
    const stepsOnThisPageCount = stepsForThisPage.length;

    const driverInstance = driver({
      showProgress: true,
      animate: true,
      smoothScroll: true,
      allowClose: true,
      stagePadding: 8,
      stageRadius: 8,
      popoverClass: "onboarding-tour-popover",
      nextBtnText: t("tours.next" as AnyKey),
      prevBtnText: t("tours.prev" as AnyKey),
      doneBtnText: t("tours.done" as AnyKey),
      steps: driverSteps,
      onDestroyStarted: () => {
        const activeIdx = driverRef.current?.getActiveIndex();

        // User completed all steps on this page (clicked Done or Next on last step)
        if (activeIdx === stepsOnThisPageCount - 1) {
          const nextGlobalIdx = lastGlobalIdx + 1;
          if (nextGlobalIdx < allSteps.length) {
            const nextStep = allSteps[nextGlobalIdx];
            // Resolve dynamic page for navigation
            const resolvedPage = resolveDynamicPage(nextStep.page, locale);
            useOnboardingStore.setState({
              activeTourStep: nextGlobalIdx,
            });
            driverRef.current?.destroy();
            if (resolvedPage && !isPageMatch(nextStep.page, currentPagePath)) {
              router.push(`/${locale}${resolvedPage}`);
            }
            return;
          }
        }

        // Either user closed early or tour is done
        driverRef.current?.destroy();
        endTour();
      },
    });

    driverRef.current = driverInstance;

    // Delay to ensure DOM elements are ready
    setTimeout(() => {
      driverInstance.drive();
    }, 300);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPagePath, locale, router, t, endTour]);

  // Start tour when activeTour changes or page changes
  useEffect(() => {
    if (!activeTour) {
      hasStartedRef.current = false;
      return;
    }

    // Reset flag when page changes so tour can restart on new page
    hasStartedRef.current = false;

    const timer = setTimeout(() => {
      if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        runTour();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [activeTour, currentPagePath, runTour]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
        driverRef.current = null;
      }
    };
  }, []);

  return { activeTour };
};
