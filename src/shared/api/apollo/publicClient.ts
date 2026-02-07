import { env } from "@shared/config/env";
import { HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { from } from "@apollo/client";
import errorLink from "./links/errorLink";

// HTTP link without auth - for public endpoints
const httpLink = new HttpLink({
  uri: env.NEXT_PUBLIC_API_URL,
  headers: {
    "X-API-Key": env.BACKEND_API_SECRET,
  },
});

// Public client without authentication - use for public endpoints like categories
export const { getClient: getPublicClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([errorLink, httpLink]),
  });
});
