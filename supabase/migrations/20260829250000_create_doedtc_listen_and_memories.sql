create table if not exists public.doedtc_listen_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  appointment_id uuid references public.doedtc_appointments (id) on delete set null,
  status text not null default 'pending'
    check (status in ('pending', 'completed', 'failed')),
  transcript text,
  summary text,
  duration_seconds integer,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists doedtc_listen_sessions_user_id_idx
  on public.doedtc_listen_sessions (user_id, created_at desc);

create table if not exists public.doedtc_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  fact text not null,
  category text not null default 'general',
  created_at timestamptz not null default now()
);

create index if not exists doedtc_memories_user_id_idx
  on public.doedtc_memories (user_id, created_at desc);

alter table public.doedtc_listen_sessions enable row level security;
alter table public.doedtc_memories enable row level security;

revoke all on public.doedtc_listen_sessions from anon, authenticated;
revoke all on public.doedtc_memories from anon, authenticated;
