import { test, expect } from "@playwright/test";
import { generateTestUser } from "../helpers/test-user";
import { SELECTORS, PRODUCTS_URL } from "../helpers/selectors";
import {
  toggleWishlist,
  getWishlistItemCount,
  getAvatarButton,
} from "../helpers/utils";

/**
 * Wishlist Operations E2E Tests
 *
 * Tests the core wishlist functionality:
 * - Adding items to wishlist
 * - Removing items from wishlist
 * - Viewing wishlist page
 * - Clearing wishlist
 * - Wishlist persistence (local storage)
 */

let TEST_USER = {
  email: "",
  password: "",
  firstname: "",
  lastname: "",
};

test.describe("Wishlist Operations", () => {
  // Create a test user once before all tests
  test.beforeAll(async ({ browser }) => {
    TEST_USER = generateTestUser();

    const page = await browser.newPage();
    await page.goto("/en/sign-up");

    await page
      .locator(SELECTORS.signUp.firstnameInput)
      .fill(TEST_USER.firstname);
    await page.locator(SELECTORS.signUp.lastnameInput).fill(TEST_USER.lastname);
    await page.locator(SELECTORS.signUp.emailInput).fill(TEST_USER.email);
    await page.locator(SELECTORS.signUp.passwordInput).fill(TEST_USER.password);
    await page.locator(SELECTORS.signUp.submitButton).click();

    // Wait for sign-up to complete (redirect to home or sign-in)
    await expect(page).toHaveURL(/(\/en\/?$|\/en\/sign-in)/, {
      timeout: 30000,
    });

    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    // Sign in before each test
    await page.goto("/en/sign-in");
    await page.locator(SELECTORS.signIn.emailInput).fill(TEST_USER.email);
    await page.locator(SELECTORS.signIn.passwordInput).fill(TEST_USER.password);
    await page.locator(SELECTORS.signIn.submitButton).click();

    await expect(page).toHaveURL(/\/en\/?$/, { timeout: 30000 });
    await expect(getAvatarButton(page)).toBeVisible({ timeout: 10000 });

    // Clear wishlist localStorage for clean state
    await page.evaluate(() => {
      localStorage.removeItem("wishlist-storage");
    });
  });

  test("should add a product to wishlist by clicking heart icon", async ({
    page,
  }) => {
    await test.step("Navigate to products page", async () => {
      await page.goto(`/en${PRODUCTS_URL}`);
      await page.waitForLoadState("networkidle");
    });

    await test.step("Verify wishlist is initially empty", async () => {
      const count = await getWishlistItemCount(page);
      expect(count).toBe(0);
    });

    await test.step("Click heart icon on product card", async () => {
      const productCard = page.locator(SELECTORS.productCard.card).first();
      await expect(productCard).toBeVisible({ timeout: 30000 });

      await toggleWishlist(page, productCard);
    });

    await test.step("Verify product was added to wishlist", async () => {
      // Navigate to wishlist page to verify item was added
      // (badge/icon state might not update immediately due to hydration)
      await page.goto("/en/wishlist");
      await page.waitForLoadState("networkidle");

      // Verify wishlist page shows the item
      const productCards = page.locator(SELECTORS.productCard.card);
      await expect(productCards.first()).toBeVisible({ timeout: 10000 });

      // Verify it's not showing empty state
      const emptyTitle = page.getByText(/your wishlist is empty/i);
      await expect(emptyTitle).toBeHidden();
    });
  });

  test("should remove product from wishlist by clicking filled heart", async ({
    page,
  }) => {
    await test.step("Navigate to products and add to wishlist", async () => {
      await page.goto(`/en${PRODUCTS_URL}`);
      await page.waitForLoadState("networkidle");

      const productCard = page.locator(SELECTORS.productCard.card).first();
      await expect(productCard).toBeVisible({ timeout: 30000 });
      await toggleWishlist(page, productCard);

      // Verify item was added by checking wishlist page
      await page.goto("/en/wishlist");
      await page.waitForLoadState("networkidle");
      const productCards = page.locator(SELECTORS.productCard.card);
      await expect(productCards.first()).toBeVisible({ timeout: 10000 });
    });

    await test.step("Remove product from wishlist via heart icon", async () => {
      // On the wishlist page, click the heart to remove
      const productCard = page.locator(SELECTORS.productCard.card).first();
      await toggleWishlist(page, productCard);

      await page.waitForTimeout(1000);
    });

    await test.step("Verify wishlist is now empty", async () => {
      // Should show empty state after removal
      const emptyTitle = page.getByRole("heading", {
        name: /your wishlist is empty/i,
      });
      await expect(emptyTitle).toBeVisible({ timeout: 10000 });
    });
  });

  test("should view wishlist page with added items", async ({ page }) => {
    await test.step("Add product to wishlist", async () => {
      await page.goto(`/en${PRODUCTS_URL}`);
      await page.waitForLoadState("networkidle");

      const productCard = page.locator(SELECTORS.productCard.card).first();
      await expect(productCard).toBeVisible({ timeout: 30000 });

      await toggleWishlist(page, productCard);
      await page.waitForTimeout(500);
    });

    await test.step("Navigate to wishlist page", async () => {
      await page.goto("/en/wishlist");
      await page.waitForLoadState("networkidle");
    });

    await test.step("Verify wishlist page shows the item", async () => {
      // Page title should be visible
      const pageTitle = page.locator("h1");
      await expect(pageTitle).toBeVisible();

      // Should NOT show empty state
      const emptyStateText = page.getByText(/your wishlist is empty/i);
      await expect(emptyStateText).toBeHidden();

      // Product cards should be visible
      const productCards = page.locator(SELECTORS.productCard.card);
      await expect(productCards.first()).toBeVisible({ timeout: 10000 });

      // Clear all button should be visible
      const clearBtn = page.locator(SELECTORS.wishlist.clearAllButton);
      await expect(clearBtn).toBeVisible();
    });
  });

  test("should show empty wishlist state when no items", async ({ page }) => {
    await test.step("Navigate to wishlist page directly", async () => {
      await page.goto("/en/wishlist");
      await page.waitForLoadState("networkidle");
    });

    await test.step("Verify empty wishlist UI", async () => {
      // Empty state message should be visible
      const emptyTitle = page.getByText(/your wishlist is empty/i);
      await expect(emptyTitle).toBeVisible({ timeout: 10000 });

      // Empty heart icon should be visible
      const emptyIcon = page.locator(".lucide-heart").first();
      await expect(emptyIcon).toBeVisible();

      // Clear all button should NOT be visible
      const clearBtn = page.locator(SELECTORS.wishlist.clearAllButton);
      await expect(clearBtn).toBeHidden();

      // No product cards should be visible
      const productCards = page.locator(SELECTORS.productCard.card);
      await expect(productCards).toHaveCount(0);
    });
  });

  test("should clear entire wishlist", async ({ page }) => {
    await test.step("Add products to wishlist", async () => {
      await page.goto(`/en${PRODUCTS_URL}`);
      await page.waitForLoadState("networkidle");

      // Add first product
      const firstProduct = page.locator(SELECTORS.productCard.card).first();
      await expect(firstProduct).toBeVisible({ timeout: 30000 });
      await toggleWishlist(page, firstProduct);

      // Verify item was added
      await page.goto("/en/wishlist");
      await page.waitForLoadState("networkidle");
      const productCards = page.locator(SELECTORS.productCard.card);
      await expect(productCards.first()).toBeVisible({ timeout: 10000 });
    });

    await test.step("Click Clear All button and accept confirmation", async () => {
      const clearBtn = page.locator(SELECTORS.wishlist.clearAllButton);
      await expect(clearBtn).toBeVisible({ timeout: 5000 });

      // Set up dialog handler BEFORE clicking - native confirm() dialog needs this
      page.once("dialog", async (dialog) => {
        await dialog.accept();
      });

      await clearBtn.click();

      // Wait for the dialog to be handled and state to update
      await page.waitForTimeout(500);
    });

    await test.step("Verify wishlist is now empty", async () => {
      // Wait for state update and UI re-render
      await page.waitForTimeout(1000);

      // Empty state should be visible
      const emptyTitle = page.getByRole("heading", {
        name: /your wishlist is empty/i,
      });
      await expect(emptyTitle).toBeVisible({ timeout: 10000 });
    });
  });

  test("should persist wishlist across page navigation", async ({ page }) => {
    await test.step("Add product to wishlist", async () => {
      await page.goto(`/en${PRODUCTS_URL}`);
      await page.waitForLoadState("networkidle");

      const productCard = page.locator(SELECTORS.productCard.card).first();
      await expect(productCard).toBeVisible({ timeout: 30000 });
      await toggleWishlist(page, productCard);

      // Verify item was added
      await page.goto("/en/wishlist");
      await page.waitForLoadState("networkidle");
      const productCards = page.locator(SELECTORS.productCard.card);
      await expect(productCards.first()).toBeVisible({ timeout: 10000 });
    });

    await test.step("Navigate to different pages", async () => {
      // Navigate to FAQ
      await page.goto("/en/faq");
      await page.waitForLoadState("networkidle");

      let count = await getWishlistItemCount(page);
      expect(count).toBe(1);

      // Navigate to About
      await page.goto("/en/about");
      await page.waitForLoadState("networkidle");

      count = await getWishlistItemCount(page);
      expect(count).toBe(1);
    });

    await test.step("Navigate to wishlist page", async () => {
      await page.goto("/en/wishlist");
      await page.waitForLoadState("networkidle");

      // Product should still be there
      const productCards = page.locator(SELECTORS.productCard.card);
      await expect(productCards.first()).toBeVisible({ timeout: 10000 });
    });

    await test.step("Go back to products and verify heart is still filled", async () => {
      await page.goto(`/en${PRODUCTS_URL}`);
      await page.waitForLoadState("networkidle");

      const productCard = page.locator(SELECTORS.productCard.card).first();
      const heartIcon = productCard.locator(".lucide-heart");

      await expect(heartIcon).toHaveClass(/fill-red-500/);
    });
  });

  test("should add multiple products to wishlist", async ({ page }) => {
    await test.step("Navigate to products", async () => {
      await page.goto(`/en${PRODUCTS_URL}`);
      await page.waitForLoadState("networkidle");
    });

    await test.step("Add first product", async () => {
      const firstProduct = page.locator(SELECTORS.productCard.card).first();
      await expect(firstProduct).toBeVisible({ timeout: 30000 });
      await toggleWishlist(page, firstProduct);
      await page.waitForTimeout(500);

      const count = await getWishlistItemCount(page);
      expect(count).toBe(1);
    });

    await test.step("Add second product", async () => {
      const secondProduct = page.locator(SELECTORS.productCard.card).nth(1);

      if (await secondProduct.isVisible().catch(() => false)) {
        await toggleWishlist(page, secondProduct);
        await page.waitForTimeout(500);

        const count = await getWishlistItemCount(page);
        expect(count).toBe(2);
      }
    });

    await test.step("Add third product", async () => {
      const thirdProduct = page.locator(SELECTORS.productCard.card).nth(2);

      if (await thirdProduct.isVisible().catch(() => false)) {
        await toggleWishlist(page, thirdProduct);
        await page.waitForTimeout(500);

        const count = await getWishlistItemCount(page);
        expect(count).toBe(3);
      }
    });

    await test.step("Verify all items on wishlist page", async () => {
      await page.goto("/en/wishlist");
      await page.waitForLoadState("networkidle");

      const productCards = page.locator(SELECTORS.productCard.card);
      const cardCount = await productCards.count();
      expect(cardCount).toBeGreaterThanOrEqual(1);
    });
  });

  test("should remove product from wishlist via wishlist page", async ({
    page,
  }) => {
    await test.step("Add product to wishlist", async () => {
      await page.goto(`/en${PRODUCTS_URL}`);
      await page.waitForLoadState("networkidle");

      const productCard = page.locator(SELECTORS.productCard.card).first();
      await expect(productCard).toBeVisible({ timeout: 30000 });
      await toggleWishlist(page, productCard);
      await page.waitForTimeout(500);
    });

    await test.step("Navigate to wishlist page", async () => {
      await page.goto("/en/wishlist");
      await page.waitForLoadState("networkidle");

      const productCards = page.locator(SELECTORS.productCard.card);
      await expect(productCards.first()).toBeVisible({ timeout: 10000 });
    });

    await test.step("Remove by clicking heart on wishlist page", async () => {
      const productCard = page.locator(SELECTORS.productCard.card).first();
      await toggleWishlist(page, productCard);

      await page.waitForTimeout(500);
    });

    await test.step("Verify wishlist is now empty", async () => {
      // Should show empty state
      const emptyTitle = page.getByText(/your wishlist is empty/i);
      await expect(emptyTitle).toBeVisible({ timeout: 5000 });

      // Badge should be gone
      const count = await getWishlistItemCount(page);
      expect(count).toBe(0);
    });
  });

  test("wishlist icon in header links to wishlist page", async ({ page }) => {
    await test.step("Navigate to home page", async () => {
      await page.goto("/en");
      await page.waitForLoadState("networkidle");
    });

    await test.step("Click wishlist icon in header", async () => {
      // Use .first() because there may be duplicate wishlist icons (Header and CategoryNavBar)
      const wishlistLink = page
        .locator(SELECTORS.wishlist.wishlistButton)
        .first();
      await expect(wishlistLink).toBeVisible({ timeout: 10000 });
      await wishlistLink.click();
    });

    await test.step("Verify navigation to wishlist page", async () => {
      await expect(page).toHaveURL(/\/en\/wishlist/);
    });
  });
});
