import { SetContextLink } from "@apollo/client/link/context";
import { cookies } from "next/headers";
import { TOKEN_COOKIE_NAME } from "../model/const";

const authLink = new SetContextLink(async (prevContext) => {
  let token: string | undefined;

  try {
    // Try to get token from cookies (only available in server context)
    token = (await cookies()).get(TOKEN_COOKIE_NAME)?.value;
  } catch {
    // Cookies not available (e.g., during static generation or client-side)
    token = undefined;
  }

  // Only add Authorization header if token exists
  // Don't send empty/undefined tokens as it can cause 401 errors on public endpoints
  if (token) {
    return {
      headers: {
        ...prevContext.headers,
        authorization: `Bearer ${token}`,
      },
    };
  }

  // For public endpoints, don't send any Authorization header
  return {
    headers: {
      ...prevContext.headers,
    },
  };
});

export default authLink;
