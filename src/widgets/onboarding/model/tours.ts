export interface TourStep {
  /** CSS selector for the element to highlight. Null = centered popover */
  element: string | null;
  /** Which page path this step belongs to (without locale prefix).
   *  Use DYNAMIC_PAGES.RANDOM_CATEGORY for steps on a random category page. */
  page: string;
  /** i18n key prefix for title and description */
  i18nKey: string;
  /** Optional: CSS selector of an element to click before this group of steps starts (e.g. to open a dialog) */
  trigger?: string;
}

export interface TourDefinition {
  id: string;
  i18nKey: string;
  steps: TourStep[];
}

/** Special page values resolved at runtime */
export const DYNAMIC_PAGES = {
  /** Resolves to a random category from the navigation (e.g. /products/electronics) */
  RANDOM_CATEGORY: "__random_category__",
} as const;

export const TOUR_IDS = {
  ACCOUNT_OVERVIEW: "account-overview",
  PROFILE_SETUP: "profile-setup",
  HOW_TO_RENT_OUT: "how-to-rent-out",
  HOW_TO_RENT: "how-to-rent",
} as const;

export type TourId = (typeof TOUR_IDS)[keyof typeof TOUR_IDS];

export const tours: Record<TourId, TourDefinition> = {
  [TOUR_IDS.ACCOUNT_OVERVIEW]: {
    id: TOUR_IDS.ACCOUNT_OVERVIEW,
    i18nKey: "tours.accountOverview",
    steps: [
      { element: '[data-tour="sidebar-my-products"]', page: "/account", i18nKey: "tours.accountOverview.steps.myProducts" },
      { element: '[data-tour="sidebar-my-rents"]', page: "/account", i18nKey: "tours.accountOverview.steps.myRents" },
      { element: '[data-tour="sidebar-my-product-rentals"]', page: "/account", i18nKey: "tours.accountOverview.steps.myProductRentals" },
      { element: '[data-tour="sidebar-documents"]', page: "/account", i18nKey: "tours.accountOverview.steps.documents" },
      { element: '[data-tour="sidebar-addresses"]', page: "/account", i18nKey: "tours.accountOverview.steps.addresses" },
      { element: '[data-tour="sidebar-settings"]', page: "/account", i18nKey: "tours.accountOverview.steps.settings" },
    ],
  },

  [TOUR_IDS.PROFILE_SETUP]: {
    id: TOUR_IDS.PROFILE_SETUP,
    i18nKey: "tours.profileSetup",
    steps: [
      { element: '[data-tour="settings-firstname"]', page: "/account/settings", i18nKey: "tours.profileSetup.steps.firstname" },
      { element: '[data-tour="settings-lastname"]', page: "/account/settings", i18nKey: "tours.profileSetup.steps.lastname" },
      { element: '[data-tour="settings-phone"]', page: "/account/settings", i18nKey: "tours.profileSetup.steps.phone" },
      { element: '[data-tour="settings-idnp"]', page: "/account/settings", i18nKey: "tours.profileSetup.steps.idnp" },
      { element: '[data-tour="settings-save"]', page: "/account/settings", i18nKey: "tours.profileSetup.steps.save" },
    ],
  },

  [TOUR_IDS.HOW_TO_RENT_OUT]: {
    id: TOUR_IDS.HOW_TO_RENT_OUT,
    i18nKey: "tours.howToRentOut",
    steps: [
      { element: '[data-tour="sidebar-settings"]', page: "/account", i18nKey: "tours.howToRentOut.steps.goToSettings" },
      { element: '[data-tour="settings-idnp"]', page: "/account/settings", i18nKey: "tours.howToRentOut.steps.fillIdnp" },
      { element: '[data-tour="settings-save"]', page: "/account/settings", i18nKey: "tours.howToRentOut.steps.saveSettings" },
      { element: '[data-tour="sidebar-my-products"]', page: "/account", i18nKey: "tours.howToRentOut.steps.goToProducts" },
      { element: '[data-tour="add-product-btn"]', page: "/account/my-products", i18nKey: "tours.howToRentOut.steps.addProduct" },
      // Form steps — trigger opens the product form dialog
      { element: '[data-tour="form-product-name"]', page: "/account/my-products", i18nKey: "tours.howToRentOut.steps.formName", trigger: '[data-tour="add-product-btn"]' },
      { element: '[data-tour="form-category"]', page: "/account/my-products", i18nKey: "tours.howToRentOut.steps.formCategory" },
      { element: '[data-tour="form-images"]', page: "/account/my-products", i18nKey: "tours.howToRentOut.steps.formImages" },
      { element: '[data-tour="form-price"]', page: "/account/my-products", i18nKey: "tours.howToRentOut.steps.formPrice" },
      { element: '[data-tour="form-submit"]', page: "/account/my-products", i18nKey: "tours.howToRentOut.steps.formSubmit" },
    ],
  },

  [TOUR_IDS.HOW_TO_RENT]: {
    id: TOUR_IDS.HOW_TO_RENT,
    i18nKey: "tours.howToRent",
    steps: [
      { element: '[data-tour="category-nav"]', page: "/account", i18nKey: "tours.howToRent.steps.browse" },
      { element: '[data-tour="product-grid"]', page: DYNAMIC_PAGES.RANDOM_CATEGORY, i18nKey: "tours.howToRent.steps.selectProduct" },
      { element: '[data-tour="product-card"]', page: DYNAMIC_PAGES.RANDOM_CATEGORY, i18nKey: "tours.howToRent.steps.addToCart" },
      { element: '[data-tour="cart-menu-btn"]', page: DYNAMIC_PAGES.RANDOM_CATEGORY, i18nKey: "tours.howToRent.steps.checkout" },
      { element: null, page: DYNAMIC_PAGES.RANDOM_CATEGORY, i18nKey: "tours.howToRent.steps.confirm" },
    ],
  },
};
