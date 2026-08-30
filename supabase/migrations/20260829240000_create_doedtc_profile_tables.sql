alter table public.doedtc_users
  add column if not exists medical_deferred boolean not null default false;

create table if not exists public.doedtc_family_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  full_name text not null,
  relationship text not null
    check (relationship in (
      'grandmother', 'grandfather', 'mother', 'father',
      'child', 'sibling', 'partner', 'other'
    )),
  phone text,
  created_at timestamptz not null default now()
);

create index if not exists doedtc_family_members_user_id_idx
  on public.doedtc_family_members (user_id);

create table if not exists public.doedtc_appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  title text not null,
  starts_at timestamptz not null,
  location text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists doedtc_appointments_user_id_idx
  on public.doedtc_appointments (user_id, starts_at desc);

create table if not exists public.doedtc_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  title text not null,
  resulted_at timestamptz not null default now(),
  source text,
  summary text,
  created_at timestamptz not null default now()
);

create index if not exists doedtc_results_user_id_idx
  on public.doedtc_results (user_id, resulted_at desc);

create table if not exists public.doedtc_locker_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  label text not null,
  username text not null default '',
  password_ciphertext text not null,
  iv text not null,
  key_version text not null default 'v1',
  created_at timestamptz not null default now()
);

create index if not exists doedtc_locker_items_user_id_idx
  on public.doedtc_locker_items (user_id);

create table if not exists public.doedtc_health_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  provider text not null check (provider in ('whoop', 'apple_health')),
  status text not null default 'disconnected'
    check (status in ('disconnected', 'pending', 'connected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);

create table if not exists public.doedtc_share_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  code text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists doedtc_share_codes_user_id_idx
  on public.doedtc_share_codes (user_id, created_at desc);

alter table public.doedtc_family_members enable row level security;
alter table public.doedtc_appointments enable row level security;
alter table public.doedtc_results enable row level security;
alter table public.doedtc_locker_items enable row level security;
alter table public.doedtc_health_connections enable row level security;
alter table public.doedtc_share_codes enable row level security;

revoke all on public.doedtc_family_members from anon, authenticated;
revoke all on public.doedtc_appointments from anon, authenticated;
revoke all on public.doedtc_results from anon, authenticated;
revoke all on public.doedtc_locker_items from anon, authenticated;
revoke all on public.doedtc_health_connections from anon, authenticated;
revoke all on public.doedtc_share_codes from anon, authenticated;
