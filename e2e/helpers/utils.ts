import { Page, expect } from "@playwright/test";
import { SELECTORS } from "./selectors";

/**
 * Click the user avatar dropdown trigger.
 * The avatar shows user initials (e.g., "TU" for "Test User").
 */
export async function clickUserAvatar(page: Page) {
  // First, dismiss any toasts that may be blocking
  const toast = page.locator(SELECTORS.toast.any);
  if (await toast.isVisible().catch(() => false)) {
    // Wait for toast to disappear (they auto-dismiss)
    await toast.waitFor({ state: "hidden", timeout: 6000 }).catch(() => {});
  }

  // The avatar button shows 2-letter initials like "TU" and has aria-haspopup="menu"
  const avatar = page.locator('button[aria-haspopup="menu"]').first();
  await avatar.click();

  // Wait for dropdown menu to appear
  await expect(page.locator(SELECTORS.userAvatar.dropdownMenu)).toBeVisible({
    timeout: 5000,
  });
}

/**
 * Get the avatar button locator for visibility checks
 */
export function getAvatarButton(page: Page) {
  return page.locator('button[aria-haspopup="menu"]').first();
}

/**
 * Sign out the current user by clicking avatar and then logout
 */
export async function signOut(page: Page) {
  await clickUserAvatar(page);
  const logoutButton = page.getByRole("menuitem", { name: /logout/i });
  await logoutButton.click();
}

/**
 * Navigate to products page and get the first product card
 */
export async function getFirstProductCard(page: Page) {
  await page.goto("/en/products", { timeout: 30000 });
  await page.waitForLoadState("networkidle");

  // Wait for skeleton to disappear (indicates products are loaded)
  await page.waitForTimeout(2000);

  const productCard = page.locator(SELECTORS.productCard.card).first();
  await expect(productCard).toBeVisible({ timeout: 30000 });

  return productCard;
}

/**
 * Wait for products to load on the current page
 */
export async function waitForProducts(page: Page) {
  // Wait for the product grid to have cards
  const productCard = page.locator(SELECTORS.productCard.card).first();
  await expect(productCard).toBeVisible({ timeout: 30000 });
}

/**
 * Add product to cart via modal
 * @param page - Playwright page
 * @param productCard - The product card locator (if not provided, uses first product)
 */
export async function addProductToCart(
  page: Page,
  productCard?: ReturnType<Page["locator"]>,
) {
  const card = productCard || page.locator(SELECTORS.productCard.card).first();

  // Click "Add to Cart" button on the product card
  const addToCartBtn = card.locator(SELECTORS.productCard.addToCartButton);
  await addToCartBtn.click();

  // Wait for modal to appear (using data-slot to identify dialog vs popover)
  const modal = page.locator(SELECTORS.addToCartModal.dialog);
  await expect(modal).toBeVisible({ timeout: 5000 });

  // Handle configurable product options FIRST (Color, Size)
  // Products may have configurable options that need to be selected
  const colorDropdown = modal
    .locator('button[role="combobox"]')
    .filter({ hasText: /Select Color/i });
  if (await colorDropdown.isVisible().catch(() => false)) {
    await colorDropdown.click();
    // Select the first color option
    const colorOption = page.locator('[role="option"]').first();
    await expect(colorOption).toBeVisible({ timeout: 3000 });
    await colorOption.click();
    await page.waitForTimeout(300);
  }

  const sizeDropdown = modal
    .locator('button[role="combobox"]')
    .filter({ hasText: /Select Size/i });
  if (await sizeDropdown.isVisible().catch(() => false)) {
    await sizeDropdown.click();
    // Select the first size option
    const sizeOption = page.locator('[role="option"]').first();
    await expect(sizeOption).toBeVisible({ timeout: 3000 });
    await sizeOption.click();
    await page.waitForTimeout(300);
  }

  // Now select dates using keyboard navigation
  // Select start date - click the date picker button to open the calendar
  const startDateBtn = modal.locator("button:has(.lucide-calendar)").first();
  await startDateBtn.click();

  // Wait for calendar popover to appear - it renders in a portal so look globally
  const calendarPopover = page.locator("[data-slot='popover-content']");
  await expect(calendarPopover).toBeVisible({ timeout: 5000 });

  // Find the calendar inside the popover
  const calendar = calendarPopover.locator("[data-slot='calendar']");

  // Find all enabled day buttons (they have data-day attribute)
  let enabledDays = calendar.locator(`button[data-day]:not([disabled])`);
  let enabledCount = await enabledDays.count();

  // If no enabled days, navigate to next month
  if (enabledCount === 0) {
    const nextMonthBtn = calendarPopover.locator(
      "button:has(.lucide-chevron-right)",
    );
    if (await nextMonthBtn.isVisible().catch(() => false)) {
      await nextMonthBtn.click();
      await page.waitForTimeout(500);
      enabledDays = calendar.locator(`button[data-day]:not([disabled])`);
      enabledCount = await enabledDays.count();
    }
  }

  // Find an enabled day button
  const dayButtons = calendar.locator(`button[data-day]:not([disabled])`);

  // Get first enabled day button
  const dayButton = dayButtons.first();
  await expect(dayButton).toBeVisible({ timeout: 3000 });

  // Standard Playwright click should work, but the popover might close
  // without selecting because of click-outside behavior
  // Let's try dispatchEvent which might be more accurate
  await dayButton.dispatchEvent("click");

  // Wait for React to process
  await page.waitForTimeout(500);

  // Check if popover closed but date wasn't selected
  // This would indicate a click-outside issue
  let startDateText = await startDateBtn.textContent();
  const popoverClosed = !(await calendarPopover.isVisible().catch(() => false));

  // If popover closed but date not selected, reopen and try again
  if (popoverClosed && startDateText?.includes("Pick")) {
    // Reopen the calendar
    await startDateBtn.click();
    await expect(calendarPopover).toBeVisible({ timeout: 3000 });

    // Wait for calendar to render
    await page.waitForTimeout(500);

    // Find enabled day again
    const newDayButton = calendar
      .locator(`button[data-day]:not([disabled])`)
      .first();
    await expect(newDayButton).toBeVisible({ timeout: 3000 });

    // Try a more aggressive click using JavaScript
    await newDayButton.evaluate((btn) => {
      // Simulate what react-day-picker expects
      const event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 0,
        buttons: 1,
      });
      // Get the onClick handler and call it directly if possible
      if (btn.onclick) {
        btn.onclick(event as unknown as PointerEvent);
      } else {
        btn.dispatchEvent(event);
      }
    });

    await page.waitForTimeout(1000);
    startDateText = await startDateBtn.textContent();
  }

  // Close popover if still open
  if (await calendarPopover.isVisible().catch(() => false)) {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
  }

  // Check final state and throw if selection failed
  startDateText = await startDateBtn.textContent();
  if (startDateText?.includes("Pick")) {
    const cancelBtn = modal.getByRole("button", { name: /cancel/i });
    if (await cancelBtn.isVisible().catch(() => false)) {
      await cancelBtn.click();
    }
    throw new Error(
      "Date picker selection not working - react-day-picker v9 Playwright compatibility issue",
    );
  }

  // Select end date - now it should be enabled
  const endDateBtn = modal.locator("button:has(.lucide-calendar)").last();
  await expect(endDateBtn).toBeEnabled({ timeout: 5000 });
  await endDateBtn.click();

  // Wait for calendar popover to appear again
  await expect(calendarPopover).toBeVisible({ timeout: 3000 });

  // For end date, find any enabled day (must be after start date)
  let endEnabledDays = calendar.locator(`button[data-day]:not([disabled])`);
  const endEnabledCount = await endEnabledDays.count();

  if (endEnabledCount === 0) {
    // Navigate to next month if no enabled days
    const nextMonthBtn = calendarPopover.locator(
      "button:has(.lucide-chevron-right)",
    );
    if (await nextMonthBtn.isVisible().catch(() => false)) {
      await nextMonthBtn.click();
      await page.waitForTimeout(500);
      endEnabledDays = calendar.locator(`button[data-day]:not([disabled])`);
    }
  }

  // Click end date day button using PointerEvents
  const endDayButton = calendar
    .locator(`button[data-day]:not([disabled])`)
    .first();
  await expect(endDayButton).toBeVisible({ timeout: 3000 });

  // Dispatch pointer events for end date
  await endDayButton.evaluate((btn) => {
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const pointerdown = new PointerEvent("pointerdown", {
      bubbles: true,
      cancelable: true,
      pointerId: 1,
      pointerType: "mouse",
      isPrimary: true,
      clientX: centerX,
      clientY: centerY,
      button: 0,
      buttons: 1,
    });
    const pointerup = new PointerEvent("pointerup", {
      bubbles: true,
      cancelable: true,
      pointerId: 1,
      pointerType: "mouse",
      isPrimary: true,
      clientX: centerX,
      clientY: centerY,
      button: 0,
      buttons: 0,
    });
    const click = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      clientX: centerX,
      clientY: centerY,
      button: 0,
    });

    btn.dispatchEvent(pointerdown);
    btn.dispatchEvent(pointerup);
    btn.dispatchEvent(click);
  });

  // Wait for calendar to close
  await page.waitForTimeout(1000);

  // If popover is still open, close it
  if (await calendarPopover.isVisible().catch(() => false)) {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
  }

  // Submit the form
  const submitBtn = modal.locator("button[type='submit']");
  await expect(submitBtn).toBeEnabled({ timeout: 5000 });
  await submitBtn.click();

  // Wait for success toast or modal to close
  await expect(modal).toBeHidden({ timeout: 10000 });
}

/**
 * Get the cart item count from header badge
 */
export async function getCartItemCount(page: Page): Promise<number> {
  const cartButton = page.locator(SELECTORS.cart.cartButton);
  const badge = cartButton.locator(".absolute");

  if (await badge.isVisible().catch(() => false)) {
    const text = await badge.textContent();
    if (text === "99+") return 100;
    return parseInt(text || "0", 10);
  }

  return 0;
}

/**
 * Get the wishlist item count from header badge
 * Uses .first() to avoid strict mode violations since there are multiple wishlist icons (Header and CategoryNavBar)
 */
export async function getWishlistItemCount(page: Page): Promise<number> {
  // Use first() since there are duplicate wishlist icons in header
  const wishlistButton = page
    .locator(SELECTORS.wishlist.wishlistButton)
    .first();
  const badge = wishlistButton.locator(".absolute");

  if (await badge.isVisible().catch(() => false)) {
    const text = await badge.textContent();
    if (text === "99+") return 100;
    return parseInt(text || "0", 10);
  }

  return 0;
}

/**
 * Toggle wishlist for a product (add or remove)
 */
export async function toggleWishlist(
  page: Page,
  productCard?: ReturnType<Page["locator"]>,
) {
  const card = productCard || page.locator(SELECTORS.productCard.card).first();

  // Hover to reveal the heart button (on desktop)
  await card.hover();

  // Wait for the heart button to be visible and clickable
  const heartBtn = card.locator(SELECTORS.productCard.heartButton);
  await expect(heartBtn).toBeVisible({ timeout: 5000 });

  // Click the heart button
  await heartBtn.click();

  // Wait a moment for the Zustand state to update
  await page.waitForTimeout(500);
}

/**
 * Clear wishlist from wishlist page
 */
export async function clearWishlist(page: Page) {
  await page.goto("/en/wishlist");

  const clearBtn = page.locator(SELECTORS.wishlist.clearAllButton);
  if (await clearBtn.isVisible().catch(() => false)) {
    await clearBtn.click();
    // Might have a confirmation dialog - handle if present
    const confirmBtn = page.getByRole("button", { name: /confirm|yes|clear/i });
    if (await confirmBtn.isVisible().catch(() => false)) {
      await confirmBtn.click();
    }
  }
}
