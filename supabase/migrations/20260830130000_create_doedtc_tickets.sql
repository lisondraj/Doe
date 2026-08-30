create table if not exists public.doedtc_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  kind text not null check (kind in ('feedback', 'bug')),
  title text not null,
  body text not null,
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists doedtc_tickets_user_id_idx
  on public.doedtc_tickets (user_id, created_at desc);

create index if not exists doedtc_tickets_status_idx
  on public.doedtc_tickets (user_id, status, created_at desc);

alter table public.doedtc_tickets enable row level security;

revoke all on public.doedtc_tickets from anon, authenticated;
