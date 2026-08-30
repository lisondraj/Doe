create table if not exists public.doedtc_guides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  title text not null,
  topic text not null,
  layout text not null default 'howto'
    check (layout in ('howto', 'schedule', 'checklist', 'explainer', 'comparison')),
  blocks jsonb not null default '[]'::jsonb,
  saved_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists doedtc_guides_saved_idx
  on public.doedtc_guides (user_id, saved_at desc)
  where archived_at is null and saved_at is not null;

create index if not exists doedtc_guides_user_created_idx
  on public.doedtc_guides (user_id, created_at desc)
  where archived_at is null;

alter table public.doedtc_guides enable row level security;
revoke all on public.doedtc_guides from anon, authenticated;
