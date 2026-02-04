# E2E Tests Documentation

## Overview

This directory contains End-to-End (E2E) tests for the Minimum frontend application using Playwright.

## Running Tests

```bash
# Run all E2E tests
bun run test:e2e

# Run with UI mode for debugging
bun run test:e2e:ui

# Run specific test file
bun run test:e2e e2e/auth/sign-in.spec.ts

# Run specific test suite
bun run test:e2e e2e/cart e2e/wishlist

# List all available tests
bun run test:e2e --list
```

## Test Structure

```
e2e/
├── helpers/
│   ├── selectors.ts    # Centralized CSS/DOM selectors
│   ├── test-user.ts    # Test user generation utilities
│   └── utils.ts        # Reusable test utilities
├── auth/               # Authentication tests
│   ├── auth-flow.spec.ts
│   ├── sign-in.spec.ts
│   ├── sign-out.spec.ts
│   └── sign-up.spec.ts
├── cart/               # Cart operation tests
│   └── cart-operations.spec.ts
├── wishlist/           # Wishlist operation tests
│   └── wishlist-operations.spec.ts
└── README.md           # This file
```

## Current Test Suites

### Authentication Tests (Working)

| File                     | Test                                     | Status     |
| ------------------------ | ---------------------------------------- | ---------- |
| `auth/auth-flow.spec.ts` | Complete authentication journey          | ✅ Working |
| `auth/auth-flow.spec.ts` | Session persistence across navigation    | ✅ Working |
| `auth/sign-in.spec.ts`   | Display sign-in form                     | ✅ Working |
| `auth/sign-in.spec.ts`   | Validation error for empty email         | ✅ Working |
| `auth/sign-in.spec.ts`   | Validation error for invalid email       | ✅ Working |
| `auth/sign-in.spec.ts`   | Validation error for empty password      | ✅ Working |
| `auth/sign-in.spec.ts`   | Error for invalid credentials            | ✅ Working |
| `auth/sign-in.spec.ts`   | Successful sign-in                       | ✅ Working |
| `auth/sign-in.spec.ts`   | Redirect authenticated user              | ✅ Working |
| `auth/sign-in.spec.ts`   | Link to sign-up page                     | ✅ Working |
| `auth/sign-in.spec.ts`   | Redirect parameter after sign in         | ✅ Working |
| `auth/sign-out.spec.ts`  | Display user avatar dropdown             | ✅ Working |
| `auth/sign-out.spec.ts`  | Open dropdown on click                   | ✅ Working |
| `auth/sign-out.spec.ts`  | Show logout option                       | ✅ Working |
| `auth/sign-out.spec.ts`  | Successful sign out                      | ✅ Working |
| `auth/sign-out.spec.ts`  | No protected route access after sign out | ✅ Working |
| `auth/sign-out.spec.ts`  | Show Sign In button after sign out       | ✅ Working |
| `auth/sign-out.spec.ts`  | Clear auth state after sign out          | ✅ Working |
| `auth/sign-up.spec.ts`   | Display sign-up form                     | ✅ Working |
| `auth/sign-up.spec.ts`   | Validation errors for empty form         | ✅ Working |
| `auth/sign-up.spec.ts`   | Validation for invalid email             | ✅ Working |
| `auth/sign-up.spec.ts`   | Validation for short password            | ✅ Working |
| `auth/sign-up.spec.ts`   | Create new account                       | ✅ Working |
| `auth/sign-up.spec.ts`   | Error for duplicate email                | ✅ Working |
| `auth/sign-up.spec.ts`   | Link to sign-in page                     | ✅ Working |

### Cart Tests (Date Picker Limitation)

| File                           | Test                                     | Status     |
| ------------------------------ | ---------------------------------------- | ---------- |
| `cart/cart-operations.spec.ts` | Open add-to-cart modal with rental dates | ✅ Working |
| `cart/cart-operations.spec.ts` | Empty cart state                         | ✅ Working |
| `cart/cart-operations.spec.ts` | Add product to cart and see badge update | ⏭️ Skipped |
| `cart/cart-operations.spec.ts` | View cart page with added items          | ⏭️ Skipped |
| `cart/cart-operations.spec.ts` | Remove item from cart                    | ⏭️ Skipped |
| `cart/cart-operations.spec.ts` | Cart persistence across navigation       | ⏭️ Skipped |
| `cart/cart-operations.spec.ts` | Add multiple products to cart            | ⏭️ Skipped |

**Note**: Cart tests that require adding products via the date picker are skipped due to a known compatibility issue between react-day-picker v9 and Playwright. The day button click executes but the `onSelect` callback doesn't trigger via automated testing. This is a testing limitation only - the component works correctly in manual testing.

### Wishlist Tests (Working - Client-Side Storage)

| File                                   | Test                                    | Status     |
| -------------------------------------- | --------------------------------------- | ---------- |
| `wishlist/wishlist-operations.spec.ts` | Add product by clicking heart icon      | ✅ Working |
| `wishlist/wishlist-operations.spec.ts` | Remove product by clicking filled heart | ✅ Working |
| `wishlist/wishlist-operations.spec.ts` | View wishlist page with items           | ✅ Working |
| `wishlist/wishlist-operations.spec.ts` | Empty wishlist state                    | ✅ Working |
| `wishlist/wishlist-operations.spec.ts` | Clear entire wishlist                   | ✅ Working |
| `wishlist/wishlist-operations.spec.ts` | Wishlist persistence across navigation  | ✅ Working |
| `wishlist/wishlist-operations.spec.ts` | Add multiple products                   | ✅ Working |
| `wishlist/wishlist-operations.spec.ts` | Remove from wishlist page               | ✅ Working |
| `wishlist/wishlist-operations.spec.ts` | Wishlist icon links to page             | ✅ Working |

## Test Dependencies

### Prerequisites

1. **Dev Server**: Tests use Playwright's `webServer` to start the dev server automatically. Alternatively, start manually with `bun run dev`.

2. **Backend API**: Cart and Wishlist tests require a running GraphQL backend. The backend URL is configured in the app.

3. **Products Data**: Tests navigate to `/products/women` (configured in `PRODUCTS_URL` constant). Ensure this category has products in the backend.

### Known Issues

1. **Sign-up Rate Limiting**: Creating new test users may be rate-limited by the backend. Tests create a user once per test suite in `beforeAll`.

2. **Product Loading**: Products load from the GraphQL API which may be slow. Tests have 30s timeout for product card visibility.

3. **Session Management**: Each test suite creates its own user to avoid session conflicts.

## Helper Files

### `helpers/selectors.ts`

Centralized DOM selectors for maintainability:

```typescript
import { SELECTORS, PRODUCTS_URL } from "../helpers/selectors";

// Use selectors in tests
page.locator(SELECTORS.signIn.emailInput);
page.locator(SELECTORS.productCard.card);
page.locator(SELECTORS.cart.removeItemButton);
```

### `helpers/utils.ts`

Reusable utility functions:

- `getAvatarButton(page)` - Get avatar button locator
- `clickUserAvatar(page)` - Click avatar to open dropdown
- `signOut(page)` - Complete sign-out flow
- `getFirstProductCard(page)` - Navigate to products and get first card
- `addProductToCart(page, card)` - Add product via modal with date selection
- `getCartItemCount(page)` - Get cart badge count
- `getWishlistItemCount(page)` - Get wishlist badge count
- `toggleWishlist(page, card)` - Click heart icon on product card

### `helpers/test-user.ts`

Test user utilities:

```typescript
import { generateTestUser, TEST_USER_CREDENTIALS } from "../helpers/test-user";

// Generate unique test user
const user = generateTestUser();

// Use permanent test user (must exist in backend)
const creds = TEST_USER_CREDENTIALS;
```

## Writing New Tests

### Test Pattern

```typescript
import { test, expect } from "@playwright/test";
import { generateTestUser } from "../helpers/test-user";
import { SELECTORS, PRODUCTS_URL } from "../helpers/selectors";
import { getAvatarButton } from "../helpers/utils";

let TEST_USER = { email: "", password: "", firstname: "", lastname: "" };

test.describe("Feature Name", () => {
  // Create user once before all tests
  test.beforeAll(async ({ browser }) => {
    TEST_USER = generateTestUser();
    const page = await browser.newPage();
    // Sign up user...
    await page.close();
  });

  // Sign in before each test
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/sign-in");
    // Fill credentials and submit...
    await expect(getAvatarButton(page)).toBeVisible({ timeout: 10000 });
  });

  test("should do something", async ({ page }) => {
    await test.step("Step description", async () => {
      // Test code
    });
  });
});
```

### Best Practices

1. **Use `test.step()`** for logical groupings within tests
2. **Add explicit timeouts** for async operations
3. **Use selectors from helpers** - don't hardcode selectors in tests
4. **Handle optional UI elements** with `.catch(() => false)`
5. **Clean up state** in `beforeEach` if needed

## Configuration

See `playwright.config.ts` for:

- Test timeout: 60s
- Action timeout: 10s
- Navigation timeout: 30s
- Browser: Chromium (headless)
- Base URL: `http://localhost:3000`

## Future Test Areas

Consider adding tests for:

- Checkout flow
- Account settings
- Address management
- Product search & filtering
- Language switching (i18n)
- My Products (seller features)
