create table if not exists public.doedtc_scheduled_texts (
  id uuid primary key default gen_random_uuid(),
  created_by_user_id uuid not null references public.doedtc_users (id) on delete cascade,
  recipient_user_id uuid references public.doedtc_users (id) on delete set null,
  recipient_member_id uuid references public.doedtc_household_members (id) on delete set null,
  recipient_phone text not null,
  send_at timestamptz not null,
  timezone text not null default 'America/New_York',
  intent text not null,
  body text not null,
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'cancelled', 'failed')),
  sent_at timestamptz,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists doedtc_scheduled_texts_due_idx
  on public.doedtc_scheduled_texts (send_at)
  where status = 'pending';

create index if not exists doedtc_scheduled_texts_created_by_idx
  on public.doedtc_scheduled_texts (created_by_user_id, created_at desc);

alter table public.doedtc_scheduled_texts enable row level security;
revoke all on public.doedtc_scheduled_texts from anon, authenticated;

alter table public.doedtc_household_consents
  add column if not exists access_revoked_at timestamptz;
