# AGENTS.md

Overview of the project for AI agents and developers working on this codebase.

## Project Overview

A single-page Arabic (RTL) lead-generation landing page for "ون كاش" (One Cash), a fictional digital
wallet brand. Visitors enter their full name and Yemeni phone number to receive a personal invite link
and a promotional welcome gift. Built with TanStack Start and deployed on Netlify, with submissions
persisted in a managed Postgres database via Drizzle ORM.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start |
| Frontend | React 19, TanStack Router v1 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 + custom CSS (`src/styles.css`) |
| Database | Netlify Database (managed Postgres) via `@netlify/database` + Drizzle ORM |
| Validation | Zod (server-side), plain regex checks (client-side) |
| Language | TypeScript (strict mode) |
| Deployment | Netlify |

## Directory Structure

```
├── db
│   ├── schema.ts          # Drizzle table definition for `invites`
│   └── index.ts           # Drizzle client bound to Netlify Database
├── drizzle.config.ts       # Drizzle Kit config; migrations output to netlify/database/migrations
├── netlify/database/migrations/  # Generated SQL migrations (do not hand-edit)
├── src
│   ├── routes
│   │   ├── __root.tsx      # Root HTML shell: RTL `<html dir="rtl" lang="ar">`, fonts, meta tags
│   │   └── index.tsx       # The entire landing page: hero, form, and success states
│   ├── server
│   │   └── invites.functions.ts  # `registerInvite` server function (validate, insert, build invite link)
│   ├── router.tsx
│   └── styles.css          # Tailwind import + One Cash design tokens/animations
├── netlify.toml
├── package.json
└── tsconfig.json
```

## Key Concepts

### Single-page flow, no route change

The success state is not a separate route — `src/routes/index.tsx` swaps the form card for a success
card via local component state after the server function resolves. This keeps the transition instant
and avoids a full page navigation/reload on mobile.

### Server function (`src/server/invites.functions.ts`)

`registerInvite` is a TanStack Start server function (`createServerFn`) that:
1. Re-validates name (Arabic characters only) and phone (Yemeni mobile prefixes `70/71/73/77`) with Zod.
2. Looks up the phone number first — resubmission from the same number returns the existing invite
   instead of creating a duplicate.
3. Generates an 8-character invite code (avoiding visually ambiguous characters) and stores the record.
4. Returns a shareable invite link built from that code.

### Database

`invites` table (`db/schema.ts`): `id`, `full_name`, `phone` (E.164-ish, `967…`), `invite_code` (unique),
`created_at`. Any schema change must be followed by `npx drizzle-kit generate --name <description>` to
produce a new migration under `netlify/database/migrations/` — Netlify applies these automatically on
deploy.

### Design identity

The visual language (dark orange-to-navy gradient hero, diagonal stripe pattern, gold accent card,
black/gold diagonal divider, teal CTA button, rounded white cards) is intentionally fixed to match the
brand reference supplied for this project — keep new UI within `src/styles.css`'s existing custom
properties (`--oc-orange`, `--oc-brown`, `--oc-gold`, `--oc-teal`, etc.) rather than introducing new ad
hoc colors.

## Conventions

- Routes: TanStack Router file-based routing under `src/routes/`.
- Server-only logic lives in `src/server/*.functions.ts` and is called via `useServerFn`.
- Styling mixes Tailwind utility classes with a small set of named custom classes (`oc-*`) in
  `styles.css` for effects Tailwind doesn't express well (gradients, diagonal stripes, keyframes).
- Import paths use the `@/` alias for `src/*`.

## Development Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
```

## Environment / Secrets

No API keys are required. The database connection is provisioned and configured automatically by
Netlify Database — no connection string needs to be set manually.
