create table if not exists public.doedtc_agent_pending (
  user_id uuid primary key references public.doedtc_users (id) on delete cascade,
  kind text not null,
  commit_tool text not null,
  args jsonb not null default '{}'::jsonb,
  summary text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists doedtc_agent_pending_created_idx
  on public.doedtc_agent_pending (created_at desc);

alter table public.doedtc_agent_pending enable row level security;
revoke all on public.doedtc_agent_pending from anon, authenticated;
