# Doe

Single Next.js 14 (App Router) app, package manager **npm**. Standard commands live in `package.json` (`dev`, `build`, `start`, `lint`, and the `remotion:*` render scripts) and `README.md`.

## Cursor Cloud specific instructions

- Dependencies are refreshed automatically by the startup update script (`npm install`). Standard workflows: `npm run dev` (http://localhost:3000), `npm run build`, `npm run lint`. There is **no automated test framework** — "testing" means running the dev server and exercising routes/flows.
- Node 22 is used here; the project targets Node 20 (`@types/node` ^20) but Next.js 14.2 runs fine on Node 22.
- `/` returns a **307 redirect to `/doehealth`** (via `middleware.ts`). Host-based rewrites in the middleware only apply on the production hosts (`doe.care` / `doehealth.care`); on localhost every route is reachable directly at its literal path.
- Marketing / blog / pitch / motion / design surfaces render with **no backend** — good for quick smoke tests.
- The data-driven flows need **Supabase** env vars in `.env.local` (see `.env.example`): `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Without them, `/join` submit (`POST /api/join/apply`) returns **HTTP 503 `"Supabase server credentials are not configured."`** and `/admin` fails to load data. The `/join` form still renders and is fillable client-side without Supabase. Schema lives in `supabase/migrations/` (table `internship_applications`, storage bucket `internship-resumes`).
- **Resend** (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`) is optional; join submissions still save without it and the confirmation email is skipped with a console warning.
- The **Remotion** video pipeline (`npm run remotion:*`) is optional and separate from the web runtime; it needs a headless Chromium with ANGLE GL. Not required to run or test the web app.
