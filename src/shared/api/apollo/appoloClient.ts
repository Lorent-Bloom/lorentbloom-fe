import { env } from "@shared/config/env";
import { HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { from } from "@apollo/client";
import authLink from "./links/authLink";
import errorLink from "./links/errorLink";

const httpLink = new HttpLink({
  uri: env.NEXT_PUBLIC_API_URL,
});

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: from([errorLink, authLink, httpLink]),
  });
});
