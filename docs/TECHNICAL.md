# OnDeck Reps — Technical Guide

## Overview

OnDeck Reps (Live Reps) is a Next.js 16 App Router application backed by Supabase (Auth, Postgres, RLS). Families post rep requests or player availability; other families browse and respond.

**Stack:** Next.js · TypeScript · Tailwind CSS + shadcn/ui · Supabase SSR

## Local development

```bash
npm install
cp .env.example .env.local   # add Supabase URL + anon key
npm run dev                  # http://localhost:3000
```

### Environment variables

Required variables are validated in `src/lib/env.ts`:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/publishable key |

`NEXT_PUBLIC_*` variables are inlined at **build time**. Set them before `npm run build` or in Cloud Build/Buildpacks.

Optional for local production testing:

| Variable | Purpose |
|----------|---------|
| `PORT` | Server port (Cloud Run sets this automatically) |

## Database setup

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL editor.
3. Optional demo data: sign up a user, copy their UUID, then run:

```sql
SELECT public.seed_demo_data('YOUR_USER_UUID_HERE');
```

### Schema

| Table | Purpose |
|-------|---------|
| `profiles` | Parent/guardian accounts |
| `player_profiles` | Youth player profiles |
| `rep_requests` | Posted rep needs |
| `request_responses` | Interest responses to requests |
| `availability_posts` | Player availability listings |

All tables use Row Level Security (RLS). Open requests and availability are publicly readable; writes are restricted to authenticated owners.

## Scripts

| Command | Use |
|---------|-----|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Production server (`next start`) |
| `npm run lint` | ESLint |

> Do **not** use `output: "standalone"` in `next.config.ts`. Cloud Run Buildpacks run `next start`, which is incompatible with standalone mode.

## Deployment

### Recommended: Cloud Run Buildpacks

```bash
gcloud run deploy ondeck-reps \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-build-env-vars NEXT_PUBLIC_SUPABASE_URL=...,NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Buildpacks run `npm run build` then `npm run start`. Cloud Run sets `PORT` automatically.

### Cloud Build (`cloudbuild.yaml`)

Uses `pack` with Google Buildpacks to build the image, push to GCR, and deploy to Cloud Run. Set `NEXT_PUBLIC_*` values as build env vars in the pack step.

### Alternative: Dockerfile

A `Dockerfile` is available for manual `docker build`. It also uses `npm run start` (not standalone). Pass build args for `NEXT_PUBLIC_*` values:

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=... \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  -t ondeck-reps .
```

## Architecture

- **Auth:** Supabase email/password; session refreshed via middleware (`src/middleware.ts`).
- **Data access:** Server components use `createClient()` from `src/lib/supabase/server.ts`; client forms use the browser client from `src/lib/supabase/client.ts`.
- **Env validation:** `src/lib/env.ts` centralizes required variable checks.
- **Security:** RLS enforces ownership — users can only edit their own records.

### Key routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login`, `/signup` | Auth |
| `/dashboard` | Parent dashboard |
| `/players/new`, `/players/[id]/edit` | Player profiles |
| `/requests` | Browse open requests |
| `/requests/new` | Create request |
| `/requests/[id]` | Request detail + responses |
| `/availability` | Browse availability |
| `/availability/new` | Post availability |
| `/availability/[id]` | Availability detail |

## MVP scope

**Included:** Auth, player profiles, requests, responses, availability posts, RLS, mobile-first UI.

**Not included:** Payments, background checks, maps, real-time chat, push notifications, ratings/reviews, calendar sync.
