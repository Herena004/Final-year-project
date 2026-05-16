# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### College Administration System (`artifacts/college-admin`)
- **Type**: React + Vite (frontend only, no backend needed)
- **Preview**: `/` (root)
- **Description**: Full college admin portal built with pure React/CSS/JS (no external UI libraries)
- **Features**:
  - Role-based login: Admin, Staff, HOD (separate logins)
  - Dashboard with performance prediction, charts, live leave approvals
  - Document management: search, filter, download
  - Leave/OD/Bonafide/Certificate request management with approve/reject
  - 6 Scholarship modules: First Graduate, BC/MBC, Post Matric, 7.5% Reservation, Merit, Fee Concession
  - Timetable auto-generator
  - Examination management
  - Settings page

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
