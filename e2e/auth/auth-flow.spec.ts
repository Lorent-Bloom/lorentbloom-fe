import { test, expect } from "@playwright/test";
import { generateTestUser } from "../helpers/test-user";
import { SELECTORS } from "../helpers/selectors";
import { signOut, getAvatarButton } from "../helpers/utils";

/**
 * Complete authentication flow test
 * Tests the full user journey: Sign Up → Sign Out → Sign In → Sign Out
 */
test.describe("Complete Authentication Flow", () => {
  test("should complete full auth journey: sign-up → sign-out → sign-in → sign-out", async ({
    page,
  }) => {
    // Generate a unique test user for this test run
    const testUser = generateTestUser();

    // ============================================
    // STEP 1: Sign Up
    // ============================================
    await test.step("Sign up with new account", async () => {
      await page.goto("/en/sign-up");

      // Fill sign-up form
      await page
        .locator(SELECTORS.signUp.firstnameInput)
        .fill(testUser.firstname);
      await page
        .locator(SELECTORS.signUp.lastnameInput)
        .fill(testUser.lastname);
      await page.locator(SELECTORS.signUp.emailInput).fill(testUser.email);
      await page
        .locator(SELECTORS.signUp.passwordInput)
        .fill(testUser.password);

      // Submit
      await page.locator(SELECTORS.signUp.submitButton).click();

      // Wait for redirect (either to home if auto-signed in, or sign-in page)
      await expect(page).toHaveURL(/(\/en\/?$|\/en\/sign-in)/, {
        timeout: 20000,
      });
    });

    // ============================================
    // STEP 2: Ensure we're signed in
    // ============================================
    await test.step("Verify user is signed in after sign-up", async () => {
      // If redirected to sign-in, sign in manually
      if (page.url().includes("/sign-in")) {
        await page.locator(SELECTORS.signIn.emailInput).fill(testUser.email);
        await page
          .locator(SELECTORS.signIn.passwordInput)
          .fill(testUser.password);
        await page.locator(SELECTORS.signIn.submitButton).click();

        await expect(page).toHaveURL(/\/en\/?$/, { timeout: 15000 });
      }

      // Verify user avatar is visible (indicating signed in state)
      await expect(getAvatarButton(page)).toBeVisible({ timeout: 10000 });
    });

    // ============================================
    // STEP 3: Sign Out
    // ============================================
    await test.step("Sign out from account", async () => {
      await signOut(page);
      await expect(page).toHaveURL(/\/en\/sign-in/, { timeout: 10000 });
    });

    // ============================================
    // STEP 4: Sign In with the same account
    // ============================================
    await test.step("Sign in with existing account", async () => {
      await page.locator(SELECTORS.signIn.emailInput).fill(testUser.email);
      await page
        .locator(SELECTORS.signIn.passwordInput)
        .fill(testUser.password);
      await page.locator(SELECTORS.signIn.submitButton).click();

      // Should redirect to home page
      await expect(page).toHaveURL(/\/en\/?$/, { timeout: 15000 });

      // Verify signed in
      await expect(getAvatarButton(page)).toBeVisible({ timeout: 10000 });
    });

    // ============================================
    // STEP 5: Final Sign Out
    // ============================================
    await test.step("Final sign out", async () => {
      await signOut(page);
      await expect(page).toHaveURL(/\/en\/sign-in/, { timeout: 10000 });

      // Verify we're logged out by going to home and checking for Sign In link
      await page.goto("/en");
      const signInLink = page.getByRole("link", { name: /sign in/i });
      await expect(signInLink).toBeVisible({ timeout: 10000 });
    });
  });

  test("should maintain session across page navigations", async ({ page }) => {
    const testUser = generateTestUser();

    // Sign up
    await page.goto("/en/sign-up");
    await page
      .locator(SELECTORS.signUp.firstnameInput)
      .fill(testUser.firstname);
    await page.locator(SELECTORS.signUp.lastnameInput).fill(testUser.lastname);
    await page.locator(SELECTORS.signUp.emailInput).fill(testUser.email);
    await page.locator(SELECTORS.signUp.passwordInput).fill(testUser.password);
    await page.locator(SELECTORS.signUp.submitButton).click();

    // Wait for redirect
    await expect(page).toHaveURL(/(\/en\/?$|\/en\/sign-in)/, {
      timeout: 20000,
    });

    // If on sign-in page, sign in
    if (page.url().includes("/sign-in")) {
      await page.locator(SELECTORS.signIn.emailInput).fill(testUser.email);
      await page
        .locator(SELECTORS.signIn.passwordInput)
        .fill(testUser.password);
      await page.locator(SELECTORS.signIn.submitButton).click();
      await expect(page).toHaveURL(/\/en\/?$/, { timeout: 15000 });
    }

    // Navigate to different pages and verify session persists
    const pagesToCheck = ["/en/faq", "/en/about", "/en/account/settings"];

    for (const pagePath of pagesToCheck) {
      await page.goto(pagePath);

      // For protected routes, should not redirect to sign-in
      if (pagePath.includes("/account")) {
        await expect(page).toHaveURL(
          new RegExp(pagePath.replace(/\//g, "\\/")),
        );
      }

      // User avatar should still be visible
      await expect(getAvatarButton(page)).toBeVisible({ timeout: 10000 });
    }
  });
});
