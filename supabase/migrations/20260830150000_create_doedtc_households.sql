create table if not exists public.doedtc_households (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references public.doedtc_users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (admin_user_id)
);

create table if not exists public.doedtc_household_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.doedtc_households (id) on delete cascade,
  user_id uuid references public.doedtc_users (id) on delete set null,
  full_name text not null,
  relationship text not null
    check (relationship in (
      'grandmother', 'grandfather', 'mother', 'father',
      'child', 'sibling', 'partner', 'other'
    )),
  phone text,
  date_of_birth date,
  role text not null default 'member'
    check (role in ('admin', 'member')),
  status text not null default 'pending'
    check (status in ('pending', 'active')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists doedtc_household_members_household_id_idx
  on public.doedtc_household_members (household_id, created_at);

create index if not exists doedtc_household_members_user_id_idx
  on public.doedtc_household_members (user_id);

create table if not exists public.doedtc_household_invites (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.doedtc_households (id) on delete cascade,
  member_id uuid not null references public.doedtc_household_members (id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists doedtc_household_invites_member_id_idx
  on public.doedtc_household_invites (member_id, created_at desc);

create table if not exists public.doedtc_household_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  household_id uuid not null references public.doedtc_households (id) on delete cascade,
  share_health text not null default 'none'
    check (share_health in ('all', 'none', 'certain')),
  allow_edits text not null default 'none'
    check (allow_edits in ('all', 'none', 'certain')),
  share_member_ids uuid[] not null default '{}',
  edit_member_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, household_id)
);

alter table public.doedtc_households enable row level security;
alter table public.doedtc_household_members enable row level security;
alter table public.doedtc_household_invites enable row level security;
alter table public.doedtc_household_consents enable row level security;

revoke all on public.doedtc_households from anon, authenticated;
revoke all on public.doedtc_household_members from anon, authenticated;
revoke all on public.doedtc_household_invites from anon, authenticated;
revoke all on public.doedtc_household_consents from anon, authenticated;
