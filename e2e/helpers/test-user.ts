/**
 * Test user utilities for E2E tests
 * Generates unique test users to avoid conflicts between test runs
 */

export function generateTestUser() {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);

  return {
    email: `test.user.${timestamp}.${randomId}@e2etest.com`,
    password: "TestPass123!",
    firstname: "Test",
    lastname: "User",
  };
}

export const TEST_USER_CREDENTIALS = {
  email: "e2e.test.permanent@minimum.md",
  password: "TestPass123!",
  firstname: "E2E",
  lastname: "Tester",
};
