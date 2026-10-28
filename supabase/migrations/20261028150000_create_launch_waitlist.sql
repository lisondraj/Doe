-- /landinglaunch "keep me up to date" signups. Written only through the Next.js API
-- (app/api/launch-waitlist) using the service role key; anon/authenticated clients have no direct access.

create table if not exists public.launch_waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null check (char_length(email) between 3 and 320),
  source text not null default 'landinglaunch'
);

create unique index if not exists launch_waitlist_email_lower_idx
  on public.launch_waitlist (lower(email));

create index if not exists launch_waitlist_created_at_idx
  on public.launch_waitlist (created_at desc);

alter table public.launch_waitlist enable row level security;

revoke all on table public.launch_waitlist from anon, authenticated;
