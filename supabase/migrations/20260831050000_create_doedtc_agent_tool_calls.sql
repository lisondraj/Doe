-- Audit log for Doe agent tool executions (one row per tool call per turn).

create table if not exists public.doedtc_agent_tool_calls (
  id uuid primary key default gen_random_uuid(),
  turn_id uuid not null,
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  tool_name text not null,
  args jsonb not null default '{}'::jsonb,
  ok boolean not null default false,
  error text,
  duration_ms integer,
  created_at timestamptz not null default now()
);

create index if not exists doedtc_agent_tool_calls_turn_id_idx
  on public.doedtc_agent_tool_calls (turn_id);

create index if not exists doedtc_agent_tool_calls_user_id_created_at_idx
  on public.doedtc_agent_tool_calls (user_id, created_at desc);

alter table public.doedtc_agent_tool_calls enable row level security;
