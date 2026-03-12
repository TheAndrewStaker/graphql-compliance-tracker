# Design: Managing Controls, Owners, and Tasks

## Overview

Adds three management pages to the client, each backed by new schema mutations on the server. Navigation between pages is handled by React Router v6. All CRUD operations use Apollo Client mutations with optimistic responses and manual cache updates — no loading states on mutations, no full refetches.

Reference: `docs/ARCHITECTURE.md` for system-wide context.

---

## New dependencies

| Package                     | Reason       |
| --------------------------- | ------------ |
| `react-router-dom` (client) | Page routing |

No date picker library — Task due date uses `<TextField type="date">` to avoid an additional MUI X dependency.

---

## Server changes

### New schema inputs and mutations

```graphql
input UpdateControlInput {
  id: ID!
  title: String!
  description: String
  category: String!
  status: ControlStatus!
}

input UpdateOwnerInput {
  id: ID!
  name: String!
  email: String!
}

input UpdateTaskInput {
  id: ID!
  notes: String
  dueDate: DateTime!
}

type Mutation {
  # existing ...
  updateControl(input: UpdateControlInput!): Control!
  deleteControl(id: ID!): ID! # returns deleted id
  updateOwner(input: UpdateOwnerInput!): Owner!
  deleteOwner(id: ID!): ID! # blocked if owner has tasks
  updateTask(input: UpdateTaskInput!): Task!
  deleteTask(id: ID!): ID!
}
```

### Resolver behaviour

- `deleteControl` — cascades: deletes all Tasks where `control === id`, then deletes the Control. Returns the deleted id.
- `deleteOwner` — blocked: throws `GraphQLError` if any Task references this owner. Returns the deleted id on success.
- `deleteTask` — unconditional delete. Returns the deleted id.
- `updateControl`, `updateOwner`, `updateTask` — find-by-id, apply patch, `{ new: true }`. Throw `GraphQLError` if not found.

### New resolver tests (server)

- `updateControl` returns updated shape
- `deleteControl` cascades Tasks
- `deleteOwner` throws when Tasks exist
- `deleteOwner` succeeds when no Tasks exist
- `deleteTask` removes the task

---

## Client changes

### Routing

`BrowserRouter` added in `main.tsx`. Routes defined in `App.tsx`:

```
/           → ControlsPage   (existing ControlsDashboard, extended)
/owners     → OwnersPage
/tasks      → TasksPage
```

### New components

| Component             | Responsibility                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------- |
| `NavBar`              | MUI `AppBar` with `Tabs` (or nav links) for Controls / Owners / Tasks. Active tab derived from `useLocation`. |
| `ControlsPage`        | Extends existing `ControlsDashboard` — adds Create button, Edit and Delete actions per row                    |
| `OwnersPage`          | DataGrid of owners + Create button + row Edit/Delete                                                          |
| `TasksPage`           | DataGrid of all tasks + Create button + row Edit/Delete                                                       |
| `ControlDialog`       | Create / Edit form for a Control (title, description, category, status)                                       |
| `OwnerDialog`         | Create / Edit form for an Owner (name, email)                                                                 |
| `TaskDialog`          | Create / Edit form for a Task (control select, owner select, dueDate, notes)                                  |
| `DeleteConfirmDialog` | Generic reusable confirmation dialog — accepts `entityName` and `onConfirm`                                   |

### New `.graphql` operations

**queries.graphql additions:**

- `GetOwners` — id, name, email
- `GetTasks` — id, notes, completed, dueDate, control { id, title }, owner { id, name }

**mutations.graphql additions:**

- `UpdateControl`, `DeleteControl`
- `CreateOwner` (already in schema, add client operation)
- `UpdateOwner`, `DeleteOwner`
- `CreateTask` (already in schema, add client operation)
- `UpdateTask`, `DeleteTask`

Run `npm run codegen` after all schema and operation changes.

### Optimistic updates

Apollo Client's `optimisticResponse` is used for all mutations so the UI reflects changes instantly with no loading states. This is well supported by our stack — `completeTask` already uses this pattern.

| Operation  | Strategy                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Update** | Full `optimisticResponse` — all fields are known client-side. Apollo merges by cache key (`id`) immediately. Rolls back automatically on server error.                                                                                                                                                                                                                                           |
| **Delete** | `optimisticResponse` returns the deleted `id`; the `update` callback calls `cache.evict` + `cache.gc()` immediately. Rolls back on error.                                                                                                                                                                                                                                                        |
| **Create** | `optimisticResponse` uses `id: 'temp-id'` as a placeholder; the `update` callback appends to the cached list. Apollo replaces the temp entry with the real record when the server responds. Because the real `id` is unknown until the server responds, the dialog stays open until the mutation settles — this is the one case where a brief loading state on the submit button is appropriate. |

Server errors (e.g. duplicate Owner email, delete-owner-with-tasks) surface via Apollo's error handling and are displayed in the open dialog. The optimistic cache write is rolled back automatically.

### Cache management

| Operation           | Cache strategy                                                                  |
| ------------------- | ------------------------------------------------------------------------------- |
| Create              | `update` callback: read cached list query, append optimistic item, write back   |
| Update              | Automatic — Apollo merges by cache key (`id`)                                   |
| Delete Control      | `update` callback: `cache.evict` the Control + each cascaded Task; `cache.gc()` |
| Delete Owner / Task | `update` callback: `cache.evict` the item; `cache.gc()`                         |

### Form validation

Client-side only — checked before the mutation fires. No external form library.

| Field            | Rule                                           |
| ---------------- | ---------------------------------------------- |
| Control title    | Required, non-empty after trim                 |
| Control category | Required, non-empty after trim                 |
| Owner name       | Required, non-empty after trim                 |
| Owner email      | Required, basic format check (`includes('@')`) |
| Task control     | Required — must have a selection               |
| Task owner       | Required — must have a selection               |
| Task dueDate     | Required, must be a valid date string          |

### Keyboard behaviour

- `onKeyDown` on each form's wrapping element: `Enter` → call submit handler (unless focus is on a multiline field)
- MUI `Dialog` handles Escape → close and focus trap natively

---

## File locations

```
client/src/
  components/
    NavBar.tsx
    ControlsPage.tsx          (replaces ControlsDashboard as the routed page)
    OwnersPage.tsx
    TasksPage.tsx
    ControlDialog.tsx
    OwnerDialog.tsx
    TaskDialog.tsx
    DeleteConfirmDialog.tsx
  graphql/
    controls.graphql          (updated)
    owners.graphql            (new)
    tasks.graphql             (updated)

server/src/
  schema/schema.graphql       (updated)
  resolvers/index.ts          (updated)
  resolvers/resolvers.test.ts (updated)
```
