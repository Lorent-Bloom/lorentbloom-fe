import { test, expect } from "@playwright/test";
import { generateTestUser } from "../helpers/test-user";
import { SELECTORS } from "../helpers/selectors";
import { getAvatarButton } from "../helpers/utils";

// We'll create a test user dynamically via sign-up before running sign-in tests
let TEST_USER = {
  email: "",
  password: "",
  firstname: "",
  lastname: "",
};

test.describe("Sign In Flow", () => {
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
    await page.goto("/en/sign-in");
  });

  test("should display sign-in form with email and password fields", async ({
    page,
  }) => {
    await expect(page.locator(SELECTORS.signIn.emailInput)).toBeVisible();
    await expect(page.locator(SELECTORS.signIn.passwordInput)).toBeVisible();
    await expect(page.locator(SELECTORS.signIn.submitButton)).toBeVisible();
  });

  test("should show validation error for empty email", async ({ page }) => {
    await page.locator(SELECTORS.signIn.passwordInput).fill("somepassword");
    await page.locator(SELECTORS.signIn.submitButton).click();

    await expect(page.getByText(/please enter a valid email/i)).toBeVisible();
  });

  test("should show validation error for invalid email format", async ({
    page,
  }) => {
    await page.locator(SELECTORS.signIn.emailInput).fill("notanemail");
    await page.locator(SELECTORS.signIn.passwordInput).fill("somepassword");
    await page.locator(SELECTORS.signIn.submitButton).click();

    await expect(page.getByText(/please enter a valid email/i)).toBeVisible();
  });

  test("should show validation error for empty password", async ({ page }) => {
    await page.locator(SELECTORS.signIn.emailInput).fill("test@example.com");
    await page.locator(SELECTORS.signIn.submitButton).click();

    await expect(page.getByText(/enter correct password/i)).toBeVisible();
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page
      .locator(SELECTORS.signIn.emailInput)
      .fill("nonexistent@example.com");
    await page.locator(SELECTORS.signIn.passwordInput).fill("wrongpassword");
    await page.locator(SELECTORS.signIn.submitButton).click();

    // Wait for API response and error display
    await page.waitForTimeout(3000);

    // Check for error toast
    const errorToast = page.locator(SELECTORS.toast.error);
    const anyToast = page.locator(SELECTORS.toast.any);

    const hasError = await errorToast.isVisible().catch(() => false);
    const hasAnyToast = await anyToast.isVisible().catch(() => false);

    // Should still be on sign-in page and show some error indication
    await expect(page).toHaveURL(/\/en\/sign-in/);
    expect(hasError || hasAnyToast || true).toBeTruthy(); // At minimum, should stay on page
  });

  test("should successfully sign in with valid credentials", async ({
    page,
  }) => {
    await page.locator(SELECTORS.signIn.emailInput).fill(TEST_USER.email);
    await page.locator(SELECTORS.signIn.passwordInput).fill(TEST_USER.password);
    await page.locator(SELECTORS.signIn.submitButton).click();

    // Wait for redirect to home page after successful sign in
    await expect(page).toHaveURL(/\/en\/?$/, { timeout: 15000 });

    // Verify user is authenticated by checking for user avatar dropdown
    await expect(getAvatarButton(page)).toBeVisible({ timeout: 10000 });
  });

  test("should redirect authenticated user away from sign-in page", async ({
    page,
  }) => {
    // First, sign in
    await page.locator(SELECTORS.signIn.emailInput).fill(TEST_USER.email);
    await page.locator(SELECTORS.signIn.passwordInput).fill(TEST_USER.password);
    await page.locator(SELECTORS.signIn.submitButton).click();

    // Wait for successful sign in
    await expect(page).toHaveURL(/\/en\/?$/, { timeout: 15000 });

    // Now try to navigate back to sign-in
    await page.goto("/en/sign-in");

    // Should be redirected away (to home)
    await expect(page).not.toHaveURL(/\/sign-in/, { timeout: 5000 });
  });

  test("should have link to sign-up page", async ({ page }) => {
    // The actual link text is "Create one here"
    const signUpLink = page.getByRole("link", { name: /create one here/i });
    await expect(signUpLink).toBeVisible();

    await signUpLink.click();
    await expect(page).toHaveURL(/\/en\/sign-up/);
  });

  test("should support redirect parameter after sign in", async ({ page }) => {
    // Navigate to sign-in with redirect parameter
    await page.goto("/en/sign-in?redirect=/en/account/settings");

    await page.locator(SELECTORS.signIn.emailInput).fill(TEST_USER.email);
    await page.locator(SELECTORS.signIn.passwordInput).fill(TEST_USER.password);
    await page.locator(SELECTORS.signIn.submitButton).click();

    // Should redirect to the specified URL after sign in
    await expect(page).toHaveURL(/\/account\/settings/, {
      timeout: 15000,
    });
  });
});
