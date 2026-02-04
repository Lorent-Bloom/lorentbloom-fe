/**
 * Page selectors for E2E tests
 * Centralized selectors make tests more maintainable
 */

// The products page requires a category slug (e.g., /products/women)
// The /products route redirects to home
export const PRODUCTS_URL = "/products/women";

export const SELECTORS = {
  // Sign-in form
  signIn: {
    emailInput: 'input[name="email"]',
    passwordInput: 'input[name="password"]',
    submitButton: 'button[type="submit"]',
    form: "form",
  },

  // Sign-up form
  signUp: {
    emailInput: 'input[name="email"]',
    passwordInput: 'input[name="password"]',
    firstnameInput: 'input[name="firstname"]',
    lastnameInput: 'input[name="lastname"]',
    submitButton: 'button[type="submit"]',
    form: "form",
  },

  // User avatar and dropdown - the avatar shows user initials like "TU"
  userAvatar: {
    // Header has: logo, search, language selector, avatar button, wishlist, cart
    // Avatar is a button with 2-letter initials in the header
    dropdownMenu: '[role="menu"]',
    logoutButton: "text=Logout",
    signInButton: "text=Sign In",
  },

  // Toast notifications
  toast: {
    success: '[data-sonner-toast][data-type="success"]',
    error: '[data-sonner-toast][data-type="error"]',
    any: "[data-sonner-toast]",
  },

  // Common
  common: {
    loadingSpinner: '[data-loading="true"]',
  },

  // Cart
  cart: {
    // Cart icon in header (ShoppingCart icon button with aria-label="Shopping cart")
    cartButton: 'button[aria-label="Shopping cart"]',
    cartBadge: 'button[aria-label="Shopping cart"] .absolute',
    // Cart page
    cartPageTitle: "h1",
    emptyCartIcon: ".lucide-shopping-bag",
    cartItem: '[class*="divide-y"] > div',
    removeItemButton: "button:has(.lucide-trash2)",
    removeItemButtonMobile: 'button:has-text("Remove")',
    proceedToCheckout: 'button:has-text("Proceed to Checkout")',
    continueShopping: 'a:has-text("Continue Shopping")',
    // Mini cart sidebar (desktop)
    miniCartSheet: "[role='dialog']",
  },

  // Wishlist
  wishlist: {
    // Wishlist icon in header (Link with "Wishlist" accessible name)
    // Use first() because there may be multiple instances
    wishlistButton: 'a[href*="/wishlist"]',
    wishlistBadge: 'a[href*="/wishlist"] .absolute',
    // Wishlist page
    wishlistPageTitle: "h1",
    emptyWishlistIcon: ".lucide-heart",
    clearAllButton: 'button:has-text("Clear All")',
    // Heart button on product cards
    heartButton: 'button[aria-label*="wishlist" i]',
    heartButtonFilled: 'button[aria-label*="wishlist" i]:has(.fill-red-500)',
  },

  // Product card
  productCard: {
    // Card component uses data-slot attribute
    card: "[data-slot='card']",
    addToCartButton: 'button:has-text("Add to Cart")',
    heartButton: "button:has(.lucide-heart)",
    productName: "[data-slot='card-title']",
    productLink: "a[href*='/products/p/']",
  },

  // Add to cart modal
  addToCartModal: {
    // Dialog uses data-slot to differentiate from popover
    dialog: "[data-slot='dialog-content']",
    startDateButton: "button:has(.lucide-calendar):first-of-type",
    endDateButton: "button:has(.lucide-calendar):last-of-type",
    // Calendar popover uses data-slot='popover-content'
    calendarPopover: "[data-slot='popover-content']",
    // Day buttons have data-day attribute with the formatted date
    calendarDay: "[data-slot='calendar'] button",
    submitButton: "[data-slot='dialog-content'] button[type='submit']",
    cancelButton: "[data-slot='dialog-content'] button[type='button']",
  },
} as const;
