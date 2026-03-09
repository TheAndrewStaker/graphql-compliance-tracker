# compliance-tracker — Project Plan

A full-stack compliance task tracking app built to demonstrate production-quality GraphQL patterns using Vanta's exact tech stack.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Apollo Client + styled-components |
| Backend | Node.js + TypeScript + Apollo Server 4 + Express |
| Database | MongoDB + Mongoose |
| Testing | Jest (resolvers) + React Testing Library (components) |

---

## Project Structure

```
compliance-tracker/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── graphql/         # Queries, mutations, fragments
│   │   ├── hooks/
│   │   └── App.tsx
│   ├── tsconfig.json
│   └── package.json
├── server/                  # Apollo Server + Express backend
│   ├── src/
│   │   ├── schema/          # SDL type definitions
│   │   ├── resolvers/       # Query + mutation resolvers
│   │   ├── models/          # Mongoose models
│   │   ├── dataloaders/     # DataLoader instances
│   │   └── index.ts
│   ├── tsconfig.json
│   └── package.json
├── PLAN.md
└── README.md
```

---

## Data Model

Three interconnected types that enable genuinely interesting nested GraphQL queries.

```graphql
enum ControlStatus {
  PASSING
  FAILING
  UNKNOWN
}

scalar DateTime

type Owner {
  id: ID!
  name: String!
  email: String!
}

type Control {
  id: ID!
  title: String!
  description: String
  category: String!
  status: ControlStatus!
}

type Task {
  id: ID!
  control: Control!
  owner: Owner!
  dueDate: DateTime!
  notes: String
  completed: Boolean!
}

input CreateControlInput {
  title: String!
  description: String
  category: String!
}

input UpdateControlStatusInput {
  id: ID!
  status: ControlStatus!
}

input CreateTaskInput {
  controlId: ID!
  ownerId: ID!
  dueDate: DateTime!
  notes: String
}

type Query {
  controls: [Control!]!
  control(id: ID!): Control
  tasks: [Task!]!
  tasksByControl(controlId: ID!): [Task!]!
  owners: [Owner!]!
}

type Mutation {
  createControl(input: CreateControlInput!): Control!
  updateControlStatus(input: UpdateControlStatusInput!): Control!
  createTask(input: CreateTaskInput!): Task!
  completeTask(id: ID!): Task!
}
```

---

## Feature Scope

### Hour 1 — Project Setup
- [x] Init monorepo with `/client` and `/server`
- [x] TypeScript configs for both packages
- [x] Apollo Server 4 + Express wired up with a health-check query
- [x] MongoDB connected via Mongoose
- [x] Environment variables via dotenv

### Hours 2–3 — Schema + Resolvers
- [x] Full SDL schema defined (see Data Model above)
- [x] Mongoose models: `Control`, `Owner`, `Task`
- [x] Query resolvers: `controls`, `control(id)`, `tasks`, `tasksByControl`, `owners`
- [x] Mutation resolvers: `createControl`, `updateControlStatus`, `createTask`, `completeTask`
- [x] DataLoader for batching Owner lookups on `Task.owner` (avoid N+1)
- [x] Custom `DateTime` scalar

### Hours 4–5 — Frontend
- [x] Apollo Client setup with `InMemoryCache`
- [x] GraphQL Code Generator — types and typed hooks generated from `schema.graphql` (no manual type duplication)
- [x] Controls dashboard — MUI DataGrid with status Chip badges (PASSING/FAILING/UNKNOWN)
- [x] Task detail drawer — MUI Drawer, opens on row click, lists tasks with owner info
- [x] `useQuery` / `useMutation` via generated typed hooks
- [x] MUI + Emotion for all UI (styled-components removed as redundant alongside MUI)

### Hour 6 — Polish
- [x] Optimistic UI update on `completeTask` mutation (instant checkbox feedback)
- [x] Filter controls by status using MUI ToggleButtonGroup
- [x] Responsive layout (usable on smaller screens)

### Hour 7 — Tests
- [x] Jest: `updateControlStatus` resolver returns correct shape
- [x] Jest: `tasksByControl` resolver filters correctly by controlId
- [x] Jest: `createTask` resolver handles missing owner gracefully
- [x] React Testing Library: `StatusBadge` renders correct MUI Chip colour per status
- [x] React Testing Library: `TaskDrawer` renders task list with owner and due date

Note: DataGrid integration is not tested in jsdom — real-browser tests against the running server are deferred to Playwright (see Future Enhancements).

### Hour 8 — README + GitHub Cleanup
- [x] README with screenshot, setup instructions, and architecture notes
- [x] `.env.local.dist` files document required environment variables
- [x] Remove all console.logs and debug artifacts (none found — codebase was clean; intentional DEV-only console.warn in apollo/client.ts retained)

---

## GraphQL Depth Signals

These are the four patterns that demonstrate GraphQL fluency beyond basic CRUD. Call them out explicitly in the README.

1. **DataLoader** — batches `Owner` lookups across all `Task` resolvers in a single request cycle, preventing N+1 database queries
2. **Custom scalar** — `DateTime` scalar with serialize/parseValue/parseLiteral implementations rather than a plain String
3. **Input types** — all mutations use named input types (`CreateTaskInput`, `UpdateControlStatusInput`) rather than bare arguments
4. **Enum type** — `ControlStatus` is a proper GraphQL enum, not a free-form string

---

## Environment Variables

```
# server/.env.local  (copy from .env.local.dist)
MONGODB_URI=mongodb://localhost:27017/compliance-tracker
PORT=4000

# client/.env.local  (copy from .env.local.dist)
VITE_GRAPHQL_URI=http://localhost:4000/graphql
```

---

## Future Enhancements

### Testing
- **Playwright** — e2e tests against the real running stack (server + MongoDB + client). Covers DataGrid rendering, row click → drawer open, completeTask checkbox flow. Replaces the need for DataGrid-specific jsdom mocking.

### Frontend
- **Paginated DataGrid** — switch `controls` query to a paginated resolver (`controlsPaginated(page, pageSize)`) and use DataGrid server-side pagination mode. Required once control counts grow beyond a few hundred rows.

- **Server package upgrades** — update to latest major versions before adding new features: `@apollo/server` 4→5, `express` 4→5, `mongoose` 8→9, `dotenv` 16→17, `@types/node`/`@types/express` to match. Each has a migration guide; do them as a single focused session before touching application code.

- **Management views (full CRUD UI)** — dedicated pages for each entity with create, edit, and delete actions, backed by the existing mutations. Requires adding React Router for navigation between views.

  | Page | Operations |
  |---|---|
  | Controls | List (existing dashboard) + Create + Edit status/description + Delete |
  | Tasks | List all or by control + Create (assign owner, control, due date) + Edit notes/due date + Delete |
  | Owners | List + Create + Edit name/email + Delete |

  Each form would use a MUI Dialog or dedicated route, with Apollo mutations wired to the generated typed hooks. Delete actions need confirmation dialogs and cache eviction (`cache.evict`) to keep the UI consistent without a full refetch.

  **Form requirements:**
  - Client-side validation before mutation fires — required fields, email format for Owner, date sanity checks for Task. MUI's `error` + `helperText` props on each field; no external form library needed at this scale.
  - Keyboard-first UX: dialogs open with focus on the first field, Tab moves through fields in logical order, Enter submits (or moves to next field where appropriate), Escape closes. MUI Dialog handles focus trapping and Escape out of the box — the main addition is wiring `onKeyDown` on the form to submit on Enter and ensuring no `autoFocus` conflicts.

### Project Structure
- **Feature-based layout** — reorganise both `client/src/` and `server/src/` from type-based folders (`components/`, `resolvers/`, `models/`) into feature folders (`controls/`, `tasks/`, `owners/`), each containing its own components, resolvers, models, graphql files, and tests. Scales significantly better as the number of domains grows — avoids large flat directories where unrelated files sit next to each other.

  ```
  client/src/features/controls/
    ControlsDashboard.tsx
    StatusBadge.tsx
    queries.graphql
  client/src/features/tasks/
    TaskDrawer.tsx
    queries.graphql

  server/src/features/controls/
    control.model.ts
    control.resolver.ts
    control.test.ts
  server/src/features/tasks/
    task.model.ts
    task.resolver.ts
  ```

### Infrastructure
- **npm workspaces + shared codegen package** — when a second client exists (mobile, public API, SSR), extract `schema.graphql` and the codegen config into a `packages/shared` workspace package. Both clients import generated types from there instead of maintaining separate codegen configs pointed at `../server`. Not worth the overhead for a single client.

---

## How to Use This File with Claude Code

Open Claude Code in the project root and start with:

> "Follow the plan in PLAN.md to scaffold this project. I'm on Windows using Git Bash."

As features are completed, check off the boxes above to keep Claude Code oriented across sessions.