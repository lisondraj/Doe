create table if not exists public.doedtc_workflows (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.doedtc_users (id) on delete cascade,
  subject_member_id uuid references public.doedtc_household_members (id) on delete set null,
  goal text not null,
  config jsonb not null default '{}'::jsonb,
  status text not null default 'active'
    check (status in ('active', 'paused', 'cancelled')),
  phase text not null default 'scheduled'
    check (phase in ('scheduled', 'awaiting_reply')),
  next_run_at timestamptz,
  awaiting_from_phone text,
  awaiting_until timestamptz,
  correlation_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists doedtc_workflows_due_idx
  on public.doedtc_workflows (next_run_at)
  where status = 'active' and phase = 'scheduled';

create index if not exists doedtc_workflows_awaiting_idx
  on public.doedtc_workflows (awaiting_from_phone, awaiting_until)
  where status = 'active' and phase = 'awaiting_reply';

create index if not exists doedtc_workflows_owner_idx
  on public.doedtc_workflows (owner_user_id, created_at desc);

alter table public.doedtc_workflows enable row level security;
revoke all on public.doedtc_workflows from anon, authenticated;
