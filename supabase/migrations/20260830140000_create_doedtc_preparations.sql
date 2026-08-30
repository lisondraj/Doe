create table if not exists public.doedtc_preparations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  code text not null,
  title text not null,
  reason text,
  payload jsonb not null default '{}'::jsonb,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists doedtc_preparations_code_idx
  on public.doedtc_preparations (code);

create index if not exists doedtc_preparations_user_id_idx
  on public.doedtc_preparations (user_id, created_at desc);

alter table public.doedtc_preparations enable row level security;

revoke all on public.doedtc_preparations from anon, authenticated;
