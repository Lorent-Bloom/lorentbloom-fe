/**
 * Checks if an error is an authentication/authorization error
 * Handles both GraphQL errors and network errors (HTTP 401)
 * @param error - The error to check
 * @returns true if the error is an auth error
 */
export function isAuthError(error: unknown): boolean {
  // Check error message for auth-related strings
  const errorMessage = error instanceof Error ? error.message : String(error);
  if (
    errorMessage.includes("401") ||
    errorMessage.includes("Unauthorized") ||
    errorMessage.includes("Consumer key has expired")
  ) {
    return true;
  }

  // Check GraphQL errors
  if (error && typeof error === "object" && "graphQLErrors" in error) {
    const graphQLErrors = (
      error as { graphQLErrors: Array<{ extensions?: { category?: string } }> }
    ).graphQLErrors;
    return graphQLErrors.some(
      (err) => err.extensions?.category === "graphql-authorization",
    );
  }

  // Check status code
  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    (error as { statusCode?: number }).statusCode === 401
  ) {
    return true;
  }

  return false;
}
