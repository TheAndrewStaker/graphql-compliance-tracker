# compliance-tracker — Project Plan

## Milestones

### M1 — Foundation (complete)
- [x] Monorepo scaffold, TypeScript configs, Docker + MongoDB
- [x] Apollo Server 5 + Express 5, full SDL schema, Mongoose models
- [x] Query and mutation resolvers, DataLoader for Owner batching, DateTime scalar
- [x] React + Apollo Client, GraphQL codegen, MUI DataGrid controls dashboard
- [x] Task drawer, optimistic UI, status filter
- [x] Resolver tests (Jest), component tests (RTL)
- [x] README, `.env.local.dist` files, package upgrades

### M2 — Management views `docs/specs/managing-controls-owners-and-tasks/`
- [x] Server — UpdateControl/Owner/Task inputs, 6 new mutations, cascade/blocked delete, resolver tests
- [x] Client — GraphQL operations, codegen, react-router-dom
- [x] Client — routing and NavBar
- [x] Client — Owners page (DataGrid, OwnerDialog, delete confirmation)
- [x] Client — Tasks page (DataGrid, TaskDialog, delete confirmation)
- [x] Client — Controls page extensions (ControlDialog, Edit/Delete actions)
- [x] Client — RTL tests, manual test doc, PLAN.md checkbox

### M3 — Playwright e2e (future)
Covers DataGrid rendering, row click → drawer, completeTask flow, and all M2 CRUD dialogs.

### M4 — Paginated controls (future)
Switch `controls` query to cursor-based pagination; DataGrid server-side pagination mode.

### M7 — Shared session scripts package (future)
Extract the `/session:close` and related session lifecycle scripts into a standalone npm package so the same workflow tooling can be used across projects without duplication. Supersedes the session close process currently documented in this project's `CLAUDE.md`.

### M6 — Shared ESLint config package (future)
Extract `config/eslint/index.ts` into a standalone npm package so the same base config
can be consumed across multiple projects without duplication.

### M5 — Feature-based layout (future)
Reorganise `client/src/` and `server/src/` from type-based folders into feature folders
(`controls/`, `tasks/`, `owners/`), each containing its own components, resolvers, models,
graphql files, and tests.

---

## Current status

**M2 complete.** M3 (Playwright e2e) is next.

---

## Decisions log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-11 | Replaced styled-components with MUI + Emotion | Redundant alongside MUI; MUI's `sx` and `styled` cover all styling needs |
| 2026-03-11 | DataLoader created per-request in Apollo context factory | Prevents cache bleed between requests; matches Apollo docs recommendation |
| 2026-03-11 | `dotenv` loads `.env.local`, not `.env` | Avoids accidental commit of real secrets; `.env.local` is gitignored by convention |
| 2026-03-11 | Cascade delete for both Control and Owner | Tasks are tightly coupled to both; orphaned tasks make no sense either way. Owner cascade chosen over blocked-delete after UX testing — blocked delete surfaced as a confusing dead end for the user |
