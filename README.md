# NAVA

NAVA is a workspace-centric social media management SaaS foundation built with Next.js, React, TypeScript, Tailwind CSS, and Supabase-ready architecture.

This first build target covers:

- landing, signup, login, onboarding, and workspace shell
- personal and agency account models
- client-aware dashboard, content, calendar, approval, audit, insight, and settings surfaces
- demo-mode persistence with clearly labeled seeded data
- initial Supabase schema and row-level security scaffolding

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Geist
- Supabase-ready auth and data boundaries
- Zod validation

## Running locally

Install dependencies and start the app:

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Demo mode vs live mode

The UI works immediately in demo mode. Demo mode:

- persists local workspace state in browser storage
- seeds believable content, audit, and insight data
- clearly labels seeded metrics and connections as demo data
- does not pretend social or email integrations are live

To prepare live Supabase wiring, copy the example environment file and add your project values:

```bash
cp .env.example .env.local
```

Required variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Supabase schema

The initial schema lives in:

```text
supabase/migrations/0001_initial_schema.sql
```

It includes core ownership and first-build-target tables for:

- profiles
- workspaces
- clients
- social_accounts
- content_items
- content_variants
- content_targets
- approval_requests
- approval_decisions
- share_links
- comments
- audit_reports
- audit_findings

Every tenant-owned table uses a `workspace_id` boundary and the migration scaffolds row-level security policies around workspace ownership.

## App structure

```text
app/
  (auth)/
  app/
  onboarding/

components/nava/
  app-shell.tsx
  auth-page.tsx
  landing-page.tsx
  nava-provider.tsx
  onboarding-page.tsx
  ui.tsx
  workspace-pages.tsx

lib/
  nava/
  supabase/
```

## Validation

Run the baseline checks with:

```bash
pnpm lint
pnpm build
```

## Notes

- Auth and platform integrations are scaffolded, not faked.
- The current implementation intentionally favors honest demo mode over pretending external services are connected.
- Client sharing, comments, and provider-specific publishing adapters can build on the same ownership architecture without rebuilding the foundation.
