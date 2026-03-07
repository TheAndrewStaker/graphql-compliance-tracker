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
- [ ] Apollo Client setup with `InMemoryCache`
- [ ] Controls dashboard — list view with status badges (PASSING/FAILING/UNKNOWN)
- [ ] Task detail drawer — opens on control click, lists tasks with owner info
- [ ] `useQuery` for data fetching, `useMutation` for state changes
- [ ] styled-components for all UI, clean and minimal

### Hour 6 — Polish
- [ ] Optimistic UI update on `completeTask` mutation (instant checkbox feedback)
- [ ] Filter controls by status on the dashboard
- [ ] Responsive layout (usable on smaller screens)

### Hour 7 — Tests
- [ ] Jest: `updateControlStatus` resolver returns correct shape
- [ ] Jest: `tasksByControl` resolver filters correctly by controlId
- [ ] Jest: `createTask` resolver handles missing owner gracefully
- [ ] React Testing Library: Controls list renders mocked query data correctly

### Hour 8 — README + GitHub Cleanup
- [ ] README with screenshot, setup instructions, and architecture notes
- [ ] Clean commit history (one commit per major milestone)
- [ ] `.env.example` with required environment variables documented
- [ ] Remove all console.logs and debug artifacts

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
# server/.env
MONGODB_URI=mongodb://localhost:27017/compliance-tracker
PORT=4000

# client/.env
REACT_APP_GRAPHQL_URI=http://localhost:4000/graphql
```

---

## How to Use This File with Claude Code

Open Claude Code in the project root and start with:

> "Follow the plan in PLAN.md to scaffold this project. I'm on Windows using Git Bash."

As features are completed, check off the boxes above to keep Claude Code oriented across sessions.