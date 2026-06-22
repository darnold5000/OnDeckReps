# Live Reps

**Find pitchers, hitters, and catchers for real baseball reps.**

A youth baseball live-reps marketplace MVP. Families post requests for pitchers, hitters, and catchers — or share player availability for live ABs, bullpens, and small group sessions.

## Tech stack

- Next.js App Router (TypeScript)
- Tailwind CSS + shadcn/ui
- Supabase Auth, Postgres, Row Level Security

## Getting started

### 1. Clone and install

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env.local` and add your project URL and anon key:

```bash
cp .env.example .env.local
```

3. Run the migration in the Supabase SQL editor:

```
supabase/migrations/001_initial_schema.sql
```

### 3. Seed demo data (optional)

1. Sign up a test user in the app
2. Copy the user's UUID from Supabase Auth
3. In the SQL editor, run:

```sql
SELECT public.seed_demo_data('YOUR_USER_UUID_HERE');
```

This creates example requests in Plainfield, Avon, and Mooresville, IN.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

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

**Not included (TODO):** Payments, background checks, maps, real-time chat, push notifications, ratings/reviews, calendar sync.

## Safety

Parents/guardians are responsible for supervision, location safety, protective equipment, and session appropriateness. Youth players should never attend sessions without a parent/guardian.
