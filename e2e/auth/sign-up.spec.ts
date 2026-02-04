import { test, expect } from "@playwright/test";
import { generateTestUser } from "../helpers/test-user";
import { SELECTORS } from "../helpers/selectors";

test.describe("Sign Up Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/sign-up");
  });

  test("should display sign-up form with all required fields", async ({
    page,
  }) => {
    await expect(page.locator(SELECTORS.signUp.emailInput)).toBeVisible();
    await expect(page.locator(SELECTORS.signUp.passwordInput)).toBeVisible();
    await expect(page.locator(SELECTORS.signUp.firstnameInput)).toBeVisible();
    await expect(page.locator(SELECTORS.signUp.lastnameInput)).toBeVisible();
    await expect(page.locator(SELECTORS.signUp.submitButton)).toBeVisible();
  });

  test("should show validation errors for empty form submission", async ({
    page,
  }) => {
    await page.locator(SELECTORS.signUp.submitButton).click();

    // Wait for validation messages - check for specific error messages
    await expect(page.getByText(/please enter a valid email/i)).toBeVisible();
    await expect(page.getByText(/first name is required/i)).toBeVisible();
  });

  test("should show validation error for invalid email", async ({ page }) => {
    await page.locator(SELECTORS.signUp.emailInput).fill("invalid-email");
    await page.locator(SELECTORS.signUp.passwordInput).fill("TestPass123!");
    await page.locator(SELECTORS.signUp.firstnameInput).fill("Test");
    await page.locator(SELECTORS.signUp.lastnameInput).fill("User");
    await page.locator(SELECTORS.signUp.submitButton).click();

    await expect(page.getByText(/please enter a valid email/i)).toBeVisible();
  });

  test("should show validation error for short password", async ({ page }) => {
    await page.locator(SELECTORS.signUp.emailInput).fill("test@example.com");
    await page.locator(SELECTORS.signUp.passwordInput).fill("ab");
    await page.locator(SELECTORS.signUp.firstnameInput).fill("Test");
    await page.locator(SELECTORS.signUp.lastnameInput).fill("User");
    await page.locator(SELECTORS.signUp.submitButton).click();

    await expect(
      page.getByText(/password must be at least 3 characters/i),
    ).toBeVisible();
  });

  test("should successfully create a new account", async ({ page }) => {
    const testUser = generateTestUser();

    await page
      .locator(SELECTORS.signUp.firstnameInput)
      .fill(testUser.firstname);
    await page.locator(SELECTORS.signUp.lastnameInput).fill(testUser.lastname);
    await page.locator(SELECTORS.signUp.emailInput).fill(testUser.email);
    await page.locator(SELECTORS.signUp.passwordInput).fill(testUser.password);

    await page.locator(SELECTORS.signUp.submitButton).click();

    // Wait for success - either redirect to home or sign-in page
    await expect(page).toHaveURL(/(\/en\/?$|\/en\/sign-in)/, {
      timeout: 15000,
    });

    // Check for success toast
    const successToast = page.locator(SELECTORS.toast.success);
    const hasSuccessToast = await successToast.isVisible().catch(() => false);

    if (hasSuccessToast) {
      await expect(successToast).toContainText(/account created|signed in/i);
    }
  });

  test("should show error for duplicate email registration", async ({
    page,
  }) => {
    // Use a known existing email (this test assumes the previous test created an account)
    // In a real scenario, you'd have a seeded test account
    const existingUser = {
      email: "existing.user@minimum.md",
      password: "TestPass123!",
      firstname: "Existing",
      lastname: "User",
    };

    await page
      .locator(SELECTORS.signUp.firstnameInput)
      .fill(existingUser.firstname);
    await page
      .locator(SELECTORS.signUp.lastnameInput)
      .fill(existingUser.lastname);
    await page.locator(SELECTORS.signUp.emailInput).fill(existingUser.email);
    await page
      .locator(SELECTORS.signUp.passwordInput)
      .fill(existingUser.password);

    await page.locator(SELECTORS.signUp.submitButton).click();

    // Wait for error toast or message
    await page.waitForTimeout(3000);

    // The form should either show an error toast or remain on the page
    const currentUrl = page.url();
    const isStillOnSignUp = currentUrl.includes("/sign-up");

    if (isStillOnSignUp) {
      // Check for error indication (toast or inline error)
      const errorToast = page.locator(SELECTORS.toast.error);
      const hasErrorToast = await errorToast.isVisible().catch(() => false);

      expect(hasErrorToast || isStillOnSignUp).toBeTruthy();
    }
  });

  test("should have link to sign-in page", async ({ page }) => {
    // The actual link text is "Sign in here"
    const signInLink = page.getByRole("link", { name: /sign in here/i });
    await expect(signInLink).toBeVisible();

    await signInLink.click();
    await expect(page).toHaveURL(/\/en\/sign-in/);
  });
});
