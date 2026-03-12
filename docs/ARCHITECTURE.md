# Architecture

## System overview

Full-stack compliance task tracker. A single-page React client communicates with a GraphQL API backed by MongoDB. The server exposes one GraphQL endpoint and one health-check endpoint; all data access goes through GraphQL.

```
Browser
  └── React 19 + Apollo Client 4 (port 5173 in dev)
        │  HTTP/GraphQL
        ▼
Express 5 + Apollo Server 5 (port 4000)
        │
        ▼
MongoDB 7 (Docker, port 27017)
```

---

## Server (`server/`)

**Runtime:** Node.js + TypeScript (compiled to CommonJS, `outDir: dist`)

**Entry point:** `src/index.ts`
- Loads `.env.local` via dotenv before any other imports
- Connects to MongoDB (`src/db.ts`)
- Creates an Apollo Server instance, calls `server.start()`
- Mounts `expressMiddleware` from `@as-integrations/express5` at `/graphql` with CORS + JSON body parsing
- Mounts a `/health` GET route
- Listens on `PORT` env var (default 4000)

**Schema:** `src/schema/schema.graphql` — SDL file loaded with `readFileSync` via `src/schema/typeDefs.ts`. Single source of truth for all types, inputs, queries, and mutations.

**Resolvers:** `src/resolvers/index.ts` — flat resolver map covering Query, Mutation, and field resolvers for `Task`, `Owner`, and `Control`. Every Mongoose query ends with `.exec()`.

**Models:** `src/models/` — one file per Mongoose model (`Control`, `Owner`, `Task`). Interfaces extend `Document`.

**DataLoader:** `src/dataloaders/ownerLoader.ts` — a fresh `DataLoader` instance is created per request inside the Apollo context factory. Batches all `Owner` lookups within a single request to prevent N+1 queries on `Task.owner`.

**Custom scalar:** `src/schema/scalars.ts` — `DateTime` scalar, serialises to/from JS `Date`.

---

## Client (`client/`)

**Build tool:** Vite 7 with `@vitejs/plugin-react`

**Entry point:** `src/main.tsx` — mounts `<App />` into `#root`

**Apollo setup:** `src/apollo/client.ts`
- `ApolloClient` with `InMemoryCache` and `HttpLink` pointing at `VITE_GRAPHQL_URI` (falls back to `http://localhost:4000/graphql` in dev with a console warning)

**App shell:** `src/App.tsx`
- Wraps the tree in `ApolloProvider` (from `@apollo/client/react`), MUI `ThemeProvider`, and `CssBaseline`
- Theme sets `Figtree` as the global font family

**Routing:** React Router v6 — `BrowserRouter` in `main.tsx`, routes defined in `App.tsx`

**Components:** `src/components/` — one component per file, PascalCase. Shared layout components (`PageContainer`, `DrawerPanel`, `FormDialog`, `DeleteConfirmDialog`) live here alongside feature components.

**GraphQL operations:** `src/graphql/` — `.graphql` files for all queries and mutations. Never inlined as `gql` strings in components.

**Codegen:** `@graphql-codegen/client-preset` generates `src/graphql/__generated__/graphql.ts` (typed document nodes + all TypeScript types). Run with `npm run codegen` after any schema or operation change. Components import `useQuery`/`useMutation` from `@apollo/client/react` and pass typed document nodes — no generated hook wrappers.

**Imports:** `@/` alias maps to `src/`. All intra-project imports use `@/`.

---

## Data model

```
Owner
  id, name, email (unique)

Control
  id, title, description?, category, status (PASSING | FAILING | UNKNOWN)

Task
  id, control → Control, owner → Owner, dueDate (DateTime), notes?, completed
```

Relationships are Mongoose `ObjectId` references. The GraphQL schema resolves `Task.control` and `Task.owner` as nested objects; `Task.owner` is batched via DataLoader.

---

## Key architectural decisions

| Decision | Rationale |
|---|---|
| DataLoader per request | Prevents N+1 on Task.owner; per-request scope ensures no cross-request cache bleed |
| `.exec()` on every Mongoose query | Mongoose 7+ re-execution guard — returns a real Promise rather than a thenable |
| `client-preset` codegen | Generates framework-agnostic typed document nodes compatible with Apollo Client 4's separated react/core packages |
| `@as-integrations/express5` | Apollo Server 5 removed built-in Express middleware; integrations are now independently versioned packages so Apollo and Express upgrade cycles are decoupled |
| MUI + Emotion (no styled-components) | MUI ships Emotion as its styling engine; adding styled-components alongside would be redundant |
| `dotenv` loads `.env.local` explicitly | Avoids accidental `.env` loading; `.env.local` is gitignored and populated from `.env.local.dist` via `npm run setup` |
| Fragment masking (`client-preset` default) | Two fragments per model: `<Model>ListFields` for DataGrid columns, `<Model>EditFields` for dialogs. Queries spread both. `useFragment as readFragment` aliased for page-level callbacks. |
| `cache.modify` for list cache updates | With fragment-masked queries, `readQuery/writeQuery` does not round-trip correctly through fragment boundaries. `cache.modify` operates at the reference level and bypasses this. All create/delete mutations use `cache.modify` with `toReference`. |
| `FormDialog` shared component | Wraps `Dialog > Box[component=form, noValidate]` with `DialogTitle`, `DialogContent`, and `DialogActions`. All CRUD dialogs compose it. `noValidate` disables browser-native constraint validation so React helperText errors render instead of browser popups. |
| Cascade delete in resolvers (not Mongoose middleware) | Explicit `deleteMany` calls before the parent delete keep the cascade visible at a single call site, make it easy to test with mocks, and avoid hidden side-effects from schema-level hooks. |
