create table if not exists public.doedtc_artifacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  slug text not null,
  title text not null,
  kind text not null default 'log'
    check (kind in ('log', 'counter', 'checklist', 'score')),
  config jsonb not null default '{"fields":[]}'::jsonb,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

create index if not exists doedtc_artifacts_user_id_idx
  on public.doedtc_artifacts (user_id, created_at desc);

create table if not exists public.doedtc_artifact_entries (
  id uuid primary key default gen_random_uuid(),
  artifact_id uuid not null references public.doedtc_artifacts (id) on delete cascade,
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  occurred_at timestamptz not null default now(),
  values jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists doedtc_artifact_entries_artifact_id_idx
  on public.doedtc_artifact_entries (artifact_id, occurred_at desc);

create index if not exists doedtc_artifact_entries_user_id_idx
  on public.doedtc_artifact_entries (user_id, occurred_at desc);

alter table public.doedtc_artifacts enable row level security;
alter table public.doedtc_artifact_entries enable row level security;

revoke all on public.doedtc_artifacts from anon, authenticated;
revoke all on public.doedtc_artifact_entries from anon, authenticated;
