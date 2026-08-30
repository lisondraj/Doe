create table if not exists public.doedtc_users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  phone text not null unique,
  full_name text,
  email text,
  why_doe text,
  status text not null default 'invited'
    check (status in ('invited', 'onboarding', 'active', 'opted_out')),
  onboarding_token text,
  onboarding_token_expires_at timestamptz,
  care_token text not null default encode(gen_random_bytes(24), 'base64'),
  linq_chat_id text,
  linq_from_number text
);

create index if not exists doedtc_users_phone_idx on public.doedtc_users (phone);
create index if not exists doedtc_users_onboarding_token_idx on public.doedtc_users (onboarding_token);
create index if not exists doedtc_users_care_token_idx on public.doedtc_users (care_token);
create index if not exists doedtc_users_status_idx on public.doedtc_users (status);

create table if not exists public.doedtc_medications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create index if not exists doedtc_medications_user_id_idx on public.doedtc_medications (user_id);

create table if not exists public.doedtc_conditions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create index if not exists doedtc_conditions_user_id_idx on public.doedtc_conditions (user_id);

create table if not exists public.doedtc_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.doedtc_users (id) on delete set null,
  direction text not null check (direction in ('inbound', 'outbound')),
  body text not null,
  linq_message_id text,
  webhook_event_id text,
  created_at timestamptz not null default now()
);

create unique index if not exists doedtc_messages_webhook_event_id_idx
  on public.doedtc_messages (webhook_event_id)
  where webhook_event_id is not null;

create index if not exists doedtc_messages_user_id_idx on public.doedtc_messages (user_id);

create table if not exists public.doedtc_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  symptoms_text text not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists doedtc_assessments_user_id_idx on public.doedtc_assessments (user_id, created_at desc);

create or replace function public.doedtc_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists doedtc_users_touch_updated_at on public.doedtc_users;
create trigger doedtc_users_touch_updated_at
before update on public.doedtc_users
for each row execute function public.doedtc_touch_updated_at();

alter table public.doedtc_users enable row level security;
alter table public.doedtc_medications enable row level security;
alter table public.doedtc_conditions enable row level security;
alter table public.doedtc_messages enable row level security;
alter table public.doedtc_assessments enable row level security;

revoke all on public.doedtc_users from anon, authenticated;
revoke all on public.doedtc_medications from anon, authenticated;
revoke all on public.doedtc_conditions from anon, authenticated;
revoke all on public.doedtc_messages from anon, authenticated;
revoke all on public.doedtc_assessments from anon, authenticated;
