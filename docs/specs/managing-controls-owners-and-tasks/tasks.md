# Tasks: Managing Controls, Owners, and Tasks

Each task is one Claude Code session. Complete in order.

---

- [x] **1. Server — schema and resolvers**
  Add `UpdateControlInput`, `UpdateOwnerInput`, `UpdateTaskInput` input types and
  `updateControl`, `deleteControl`, `updateOwner`, `deleteOwner`, `updateTask`, `deleteTask`
  mutations to the schema. Implement all 6 resolvers (cascade delete for Control,
  blocked delete for Owner). Add resolver tests. Confirm `npx tsc --noEmit` and
  `npm test` pass in `server/`.

- [x] **2. Client — GraphQL operations and codegen**
  Install `react-router-dom`. Add `GetOwners` and `GetTasks` queries. Add all new
  mutation operations (`CreateOwner`, `UpdateControl`, `DeleteControl`, `UpdateOwner`,
  `DeleteOwner`, `CreateTask`, `UpdateTask`, `DeleteTask`) to `mutations.graphql`.
  Run `npm run codegen` and confirm clean output and zero TS errors in `client/`.

- [x] **3. Client — routing and navigation**
  Wrap the app in `BrowserRouter` in `main.tsx`. Define routes (`/`, `/owners`,
  `/tasks`) in `App.tsx`. Build `NavBar` (MUI AppBar with active-link highlighting
  via `useLocation`). Confirm existing Controls page still works at `/`.

- [x] **4. Client — Owners page**
  Build `OwnersPage` (DataGrid), `OwnerDialog` (create/edit form with validation),
  and wire `DeleteConfirmDialog`. Implement optimistic mutations for create, update,
  and delete. Handle the blocked-delete server error in the dialog. Confirm TS and
  visual sign-off from user.

- [x] **5. Client — Tasks page**
  Build `TasksPage` (DataGrid with control title and owner name columns), `TaskDialog`
  (control select, owner select, dueDate, notes). Wire delete confirmation. Implement
  optimistic mutations. Confirm TS and visual sign-off from user.

- [x] **6. Client — Controls page extensions**
  Build `DeleteConfirmDialog` (generic, reused by all pages) and `ControlDialog`
  (create/edit form). Extend `ControlsDashboard` into `ControlsPage` with Create
  button and per-row Edit/Delete actions. Implement optimistic mutations with cascade
  cache eviction on delete. Confirm TS and visual sign-off from user.

- [x] **7. Client — tests and docs**
  Add RTL tests: `OwnerDialog` validation errors on empty submit; `DeleteConfirmDialog`
  calls `onConfirm` on confirm and not on cancel. Create
  `docs/testing/manual/managing-controls-owners-and-tasks.md`. Update PLAN.md
  milestone checkbox. Run full `npm test` in both packages.
