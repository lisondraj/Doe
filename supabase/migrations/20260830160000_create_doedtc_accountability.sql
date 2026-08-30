create table if not exists public.doedtc_accountability_pacts (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.doedtc_users (id) on delete cascade,
  subject_user_id uuid references public.doedtc_users (id) on delete set null,
  subject_member_id uuid references public.doedtc_household_members (id) on delete set null,
  title text not null,
  goal text not null,
  status text not null default 'draft'
    check (status in ('draft', 'pending_partner', 'active', 'paused', 'withdrawn', 'completed')),
  mechanics jsonb not null default '{}',
  message_pack jsonb not null default '{}',
  next_check_in_at timestamptz,
  last_check_in_prompt_at timestamptz,
  withdrawn_at timestamptz,
  withdrawn_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists doedtc_accountability_pacts_owner_user_id_idx
  on public.doedtc_accountability_pacts (owner_user_id, created_at desc);

create index if not exists doedtc_accountability_pacts_subject_user_id_idx
  on public.doedtc_accountability_pacts (subject_user_id);

create index if not exists doedtc_accountability_pacts_due_idx
  on public.doedtc_accountability_pacts (next_check_in_at)
  where status = 'active';

create table if not exists public.doedtc_accountability_participants (
  id uuid primary key default gen_random_uuid(),
  pact_id uuid not null references public.doedtc_accountability_pacts (id) on delete cascade,
  user_id uuid references public.doedtc_users (id) on delete set null,
  household_member_id uuid references public.doedtc_household_members (id) on delete set null,
  phone text,
  full_name text not null,
  role text not null
    check (role in ('owner', 'subject', 'partner')),
  status text not null default 'pending'
    check (status in ('pending', 'active', 'declined', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists doedtc_accountability_participants_pact_id_idx
  on public.doedtc_accountability_participants (pact_id, created_at);

create index if not exists doedtc_accountability_participants_user_id_idx
  on public.doedtc_accountability_participants (user_id);

create index if not exists doedtc_accountability_participants_phone_idx
  on public.doedtc_accountability_participants (phone);

create table if not exists public.doedtc_accountability_events (
  id uuid primary key default gen_random_uuid(),
  pact_id uuid not null references public.doedtc_accountability_pacts (id) on delete cascade,
  actor_user_id uuid references public.doedtc_users (id) on delete set null,
  kind text not null
    check (kind in (
      'check_in', 'check_in_prompt', 'miss', 'invite_sent', 'partner_joined',
      'withdrawn', 'paused', 'resumed', 'note'
    )),
  outcome text check (outcome in ('yes', 'no', 'skip') or outcome is null),
  body text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists doedtc_accountability_events_pact_id_idx
  on public.doedtc_accountability_events (pact_id, occurred_at desc);

alter table public.doedtc_accountability_pacts enable row level security;
alter table public.doedtc_accountability_participants enable row level security;
alter table public.doedtc_accountability_events enable row level security;

revoke all on public.doedtc_accountability_pacts from anon, authenticated;
revoke all on public.doedtc_accountability_participants from anon, authenticated;
revoke all on public.doedtc_accountability_events from anon, authenticated;
