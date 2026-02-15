import type { TourId } from "./tours";

export interface OnboardingState {
  dismissed: boolean;
  welcomeShown: boolean;
  restarted: boolean;
  activeTour: TourId | null;
  activeTourStep: number;
  dismiss: () => void;
  markWelcomeShown: () => void;
  reset: () => void;
  startTour: (tourId: TourId) => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;
}

export interface OnboardingStatusProps {
  hasIdnp: boolean;
  hasProducts: boolean;
}

export interface OnboardingProviderProps {
  hasIdnp: boolean;
  hasProducts: boolean;
  locale: string;
}

export interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

export interface OnboardingBannerProps {
  hasIdnp: boolean;
  hasProducts: boolean;
  restarted: boolean;
  locale: string;
  onDismiss: () => void;
}

export interface OnboardingStepProps {
  stepNumber: number;
  title: string;
  description: string;
  completed: boolean;
  actionLabel: string;
  actionHref: string;
}

export interface GuideSelectionModalProps {
  open: boolean;
  onClose: () => void;
}
