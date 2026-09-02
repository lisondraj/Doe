-- Durable open-loop jobs (Instinct-class persistent work between iMessages).

create table if not exists public.doedtc_open_loops (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users(id) on delete cascade,
  goal text not null,
  status text not null default 'open'
    check (status in ('open', 'waiting_user', 'waiting_tool', 'done', 'cancelled')),
  last_action text,
  next_wake_at timestamptz,
  context_json jsonb not null default '{}'::jsonb,
  browser_job_id uuid references public.doedtc_browser_jobs(id) on delete set null,
  source text not null default 'agent'
    check (source in ('agent', 'care_seed', 'planner')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists doedtc_open_loops_user_status_idx
  on public.doedtc_open_loops (user_id, status);

create index if not exists doedtc_open_loops_next_wake_idx
  on public.doedtc_open_loops (next_wake_at)
  where status in ('open', 'waiting_tool', 'waiting_user');

create table if not exists public.doedtc_proactive_outbound_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users(id) on delete cascade,
  kind text not null,
  body text not null,
  open_loop_id uuid references public.doedtc_open_loops(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists doedtc_proactive_outbound_user_created_idx
  on public.doedtc_proactive_outbound_log (user_id, created_at desc);

alter table public.doedtc_open_loops enable row level security;
alter table public.doedtc_proactive_outbound_log enable row level security;
revoke all on public.doedtc_open_loops from anon, authenticated;
revoke all on public.doedtc_proactive_outbound_log from anon, authenticated;
