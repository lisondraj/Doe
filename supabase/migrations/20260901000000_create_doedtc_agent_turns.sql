-- Turn-level audit for Doe agent lifecycle (read receipt, working, done).

create table if not exists public.doedtc_agent_turns (
  id uuid primary key,
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  inbound_message_id text,
  inbound_text text not null default '',
  status text not null default 'received',
  read_at timestamptz,
  working_at timestamptz,
  done_at timestamptz,
  reply_text text,
  thread_reply boolean not null default false,
  final_reaction text,
  browser_job_id uuid,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists doedtc_agent_turns_user_id_created_at_idx
  on public.doedtc_agent_turns (user_id, created_at desc);

alter table public.doedtc_agent_turns enable row level security;
