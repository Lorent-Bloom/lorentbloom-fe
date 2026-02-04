import { onError } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";

// Check if error is an authentication error
function isAuthError(error: { message?: string; extensions?: { category?: string } }): boolean {
  const { message = "", extensions } = error;
  return (
    message.includes("Consumer key has expired") ||
    message.includes("Unauthorized") ||
    message.includes("not authorized") ||
    extensions?.category === "graphql-authentication"
  );
}

// Error link to handle authentication errors globally
// Note: Cookie clearing must be done via server action or API route, not here
const errorLink = onError(({ error }) => {
  // Handle GraphQL errors
  if (CombinedGraphQLErrors.is(error)) {
    for (const err of error.errors) {
      if (isAuthError(err)) {
        console.error("Authentication error detected - token likely expired");
        break;
      }
    }
  } else {
    // Handle network errors (including HTTP 401)
    const errorMessage = error.message || "";
    if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
      console.error("Authentication error detected - token likely expired");
    }
  }
});

export default errorLink;
