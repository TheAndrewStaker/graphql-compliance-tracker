# compliance-tracker — Claude Code Context

## Project
Full-stack GraphQL compliance task tracker. See PLAN.md for full feature scope and progress.

## Stack
- **Server**: Node.js + TypeScript + Apollo Server 4 + Express, port 4000
- **Client**: React + TypeScript + Apollo Client + styled-components + Vite (not yet scaffolded)
- **Database**: MongoDB via Mongoose (Docker)
- **Testing**: Jest (server resolvers) + React Testing Library (client components)

## Key conventions
- Schema lives in `server/src/schema/schema.graphql` (SDL file, loaded with `readFileSync`)
- Every Mongoose query in a resolver must end with `.exec()` to return a real Promise (Mongoose 7+ re-execution guard)
- A fresh `ownerLoader` DataLoader is created per-request in the Apollo context factory to ensure per-request batching
- `dotenv` is configured to load `.env.local` explicitly — not `.env`
- `predev` npm script handles copying `.env.local.dist` → `.env.local` on first run (cross-platform Node inline)

## Environment
- Platform: Windows + Git Bash
- npm scripts must use cross-platform syntax (no `[ -f ... ]` bash conditions — use `node -e` inline instead)
- MongoDB runs in Docker: `docker compose up -d` from project root

## Running locally
```bash
# Start MongoDB
docker compose up -d

# Start server (auto-copies .env.local.dist on first run)
cd server && npm run dev
# → http://localhost:4000/graphql
# → http://localhost:4000/health

# Start client (not yet set up)
cd client && npm run dev
# → http://localhost:5173
```

## Current status
Server milestone complete and verified:
- All queries and mutations working against live MongoDB
- DataLoader wired into Apollo context
- DateTime scalar implemented
- Health check endpoint at `/health`

Client scaffold started (`client/package.json` created) but Vite/React files not yet written.

## Commit style
One commit per major milestone. Current milestones:
1. `feat: scaffold server — Apollo Server 4, schema, resolvers, DataLoader, DateTime scalar` ← next commit
2. `feat: scaffold client — Vite + React + Apollo Client + styled-components`
3. `feat: UI — controls dashboard, task drawer, optimistic updates`
4. `feat: tests — resolver unit tests + RTL component tests`

## What to do next
Pick up at **client scaffold** — `client/` has `package.json` but needs:
- `vite.config.ts`
- `tsconfig.json`
- `index.html`
- `src/main.tsx` + `src/App.tsx`
- Apollo Client setup (`src/apollo/client.ts`)
- `src/graphql/` — queries and mutations as `.graphql` files
