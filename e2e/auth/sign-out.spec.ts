import { test, expect } from "@playwright/test";
import { generateTestUser } from "../helpers/test-user";
import { SELECTORS } from "../helpers/selectors";
import { clickUserAvatar, signOut, getAvatarButton } from "../helpers/utils";

// We'll create a test user dynamically via sign-up before running sign-out tests
let TEST_USER = {
  email: "",
  password: "",
  firstname: "",
  lastname: "",
};

test.describe("Sign Out Flow", () => {
  // Create a test user once before all tests in this describe block
  test.beforeAll(async ({ browser }) => {
    TEST_USER = generateTestUser();

    const page = await browser.newPage();
    await page.goto("/en/sign-up");

    // Sign up to create the test user
    await page
      .locator(SELECTORS.signUp.firstnameInput)
      .fill(TEST_USER.firstname);
    await page.locator(SELECTORS.signUp.lastnameInput).fill(TEST_USER.lastname);
    await page.locator(SELECTORS.signUp.emailInput).fill(TEST_USER.email);
    await page.locator(SELECTORS.signUp.passwordInput).fill(TEST_USER.password);
    await page.locator(SELECTORS.signUp.submitButton).click();

    // Wait for sign-up to complete (redirect to home or sign-in)
    await expect(page).toHaveURL(/(\/en\/?$|\/en\/sign-in)/, {
      timeout: 20000,
    });

    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    // Sign in before each test
    await page.goto("/en/sign-in");
    await page.locator(SELECTORS.signIn.emailInput).fill(TEST_USER.email);
    await page.locator(SELECTORS.signIn.passwordInput).fill(TEST_USER.password);
    await page.locator(SELECTORS.signIn.submitButton).click();

    // Wait for successful sign in
    await expect(page).toHaveURL(/\/en\/?$/, { timeout: 15000 });
  });

  test("should display user avatar dropdown when signed in", async ({
    page,
  }) => {
    await expect(getAvatarButton(page)).toBeVisible({ timeout: 10000 });
  });

  test("should open dropdown menu when clicking avatar", async ({ page }) => {
    await clickUserAvatar(page);
    const dropdownMenu = page.locator(SELECTORS.userAvatar.dropdownMenu);
    await expect(dropdownMenu).toBeVisible();
  });

  test("should show logout option in dropdown menu", async ({ page }) => {
    await clickUserAvatar(page);
    const logoutButton = page.getByRole("menuitem", { name: /logout/i });
    await expect(logoutButton).toBeVisible();
  });

  test("should successfully sign out when clicking logout", async ({
    page,
  }) => {
    await signOut(page);
    await expect(page).toHaveURL(/\/en\/sign-in/, { timeout: 10000 });
  });

  test("should not have access to protected routes after sign out", async ({
    page,
  }) => {
    await signOut(page);
    await expect(page).toHaveURL(/\/en\/sign-in/, { timeout: 10000 });

    // Try to access a protected route
    await page.goto("/en/account/settings");

    // Should be redirected to sign-in (middleware protection)
    await expect(page).toHaveURL(/\/sign-in/, { timeout: 10000 });
  });

  test("should show Sign In button in header after sign out", async ({
    page,
  }) => {
    await signOut(page);
    await expect(page).toHaveURL(/\/en\/sign-in/, { timeout: 10000 });

    // Go to home page
    await page.goto("/en");

    // Should see Sign In link/button instead of avatar
    const signInLink = page.getByRole("link", { name: /sign in/i });
    await expect(signInLink).toBeVisible({ timeout: 10000 });
  });

  test("should clear authentication state after sign out", async ({
    page,
    context,
  }) => {
    await signOut(page);
    await expect(page).toHaveURL(/\/en\/sign-in/, { timeout: 10000 });

    // Check that auth cookie is cleared
    const cookies = await context.cookies();
    const authCookie = cookies.find(
      (c) => c.name === "customer_token" || c.name === "auth_token",
    );

    // Auth cookie should either be deleted or not exist
    expect(authCookie?.value).toBeFalsy();
  });
});
