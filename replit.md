# [Project name]

_Replace the heading above with the project's name, and this line with one sentence describing what this app does for users._

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run dev:web` — run the Jany Działki frontend; `/api` requests proxy to `API_PROXY_URL` or `http://localhost:5000`
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm start` — run the API server, which also serves `artifacts/jany-dzialki/dist/public` when it exists
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required DB env: `DATABASE_URL` — Postgres connection string
- Required contact form env: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`
- Optional contact form env: `SMTP_SECURE`, `SMTP_REQUIRE_TLS`, `CONTACT_FROM`, `CONTACT_RATE_LIMIT_MAX`, `SMTP_TIMEOUT_MS`
- Render deploy: `render.yaml` builds with `pnpm run render:build` and starts with `pnpm start`; set SMTP secrets in Render before first deploy.
- Render note: Gmail SMTP uses ports 465/587, so direct SMTP requires a paid Render web service. Free Render web services block outbound SMTP ports.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
