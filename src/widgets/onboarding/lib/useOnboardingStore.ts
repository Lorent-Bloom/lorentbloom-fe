"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OnboardingState } from "../model/interface";
import { ONBOARDING_STORAGE_KEY } from "../model/const";

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      dismissed: false,
      welcomeShown: false,
      restarted: false,
      activeTour: null,
      activeTourStep: 0,

      dismiss: () => {
        set({ dismissed: true, restarted: false });
      },

      markWelcomeShown: () => {
        set({ welcomeShown: true });
      },

      reset: () => {
        set({ dismissed: false, welcomeShown: false, restarted: true });
      },

      startTour: (tourId) => {
        set({ activeTour: tourId, activeTourStep: 0 });
      },

      nextTourStep: () => {
        set({ activeTourStep: get().activeTourStep + 1 });
      },

      prevTourStep: () => {
        const current = get().activeTourStep;
        if (current > 0) {
          set({ activeTourStep: current - 1 });
        }
      },

      endTour: () => {
        set({ activeTour: null, activeTourStep: 0 });
      },
    }),
    {
      name: ONBOARDING_STORAGE_KEY,
      partialize: (state) => ({
        dismissed: state.dismissed,
        welcomeShown: state.welcomeShown,
        restarted: state.restarted,
        activeTour: state.activeTour,
        activeTourStep: state.activeTourStep,
      }),
    },
  ),
);
