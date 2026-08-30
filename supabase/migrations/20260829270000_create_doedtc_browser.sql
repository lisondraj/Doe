create table if not exists public.doedtc_browser_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  status text not null default 'open'
    check (status in ('open', 'needs_login', 'pending_confirm', 'committed', 'failed', 'cancelled')),
  intent text not null,
  allowed_host text,
  mode text not null default 'research'
    check (mode in ('research', 'login', 'write')),
  kernel_session_id text,
  kernel_profile_id text,
  browser_live_view_url text,
  pending_action jsonb,
  last_work_token text,
  login_attempts integer not null default 0,
  confirmed_at timestamptz,
  outcome text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists doedtc_browser_jobs_user_id_idx
  on public.doedtc_browser_jobs (user_id, created_at desc);

create index if not exists doedtc_browser_jobs_open_user_idx
  on public.doedtc_browser_jobs (user_id, status)
  where status in ('open', 'needs_login', 'pending_confirm');

create table if not exists public.doedtc_vault_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  host text not null,
  username text not null,
  password_ciphertext text,
  iv text,
  key_version text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, host)
);

create index if not exists doedtc_vault_items_user_id_idx
  on public.doedtc_vault_items (user_id);

create table if not exists public.doedtc_browser_shots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  job_id uuid not null references public.doedtc_browser_jobs (id) on delete cascade,
  blob_url text not null,
  pathname text not null,
  expires_at timestamptz not null,
  kind text not null default 'progress'
    check (kind in ('progress', 'review', 'result', 'error')),
  caption text,
  created_at timestamptz not null default now()
);

create index if not exists doedtc_browser_shots_job_id_idx
  on public.doedtc_browser_shots (job_id, created_at desc);

create table if not exists public.doedtc_work_tokens (
  token text primary key,
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  job_id uuid not null references public.doedtc_browser_jobs (id) on delete cascade,
  shot_id uuid references public.doedtc_browser_shots (id) on delete set null,
  purpose text not null default 'work'
    check (purpose in ('work', 'vault')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists doedtc_work_tokens_job_id_idx
  on public.doedtc_work_tokens (job_id);

alter table public.doedtc_browser_jobs enable row level security;
alter table public.doedtc_vault_items enable row level security;
alter table public.doedtc_browser_shots enable row level security;
alter table public.doedtc_work_tokens enable row level security;

revoke all on public.doedtc_browser_jobs from anon, authenticated;
revoke all on public.doedtc_vault_items from anon, authenticated;
revoke all on public.doedtc_browser_shots from anon, authenticated;
revoke all on public.doedtc_work_tokens from anon, authenticated;
