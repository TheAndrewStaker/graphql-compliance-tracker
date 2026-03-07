import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const FALLBACK_URI = 'http://localhost:4000/graphql';

if (import.meta.env.DEV && !import.meta.env.VITE_GRAPHQL_URI) {
  console.warn(
    '[Apollo] VITE_GRAPHQL_URI is not set. ' +
    'Run `npm run setup` in the client directory to create .env.local from .env.local.dist. ' +
    `Falling back to ${FALLBACK_URI}.`
  );
}

export const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URI ?? FALLBACK_URI,
  }),
  cache: new InMemoryCache(),
});
