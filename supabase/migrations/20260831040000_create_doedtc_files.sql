-- Patient and agent file blobs referenced by id (bytes never enter prompts)
create table if not exists public.doedtc_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users(id) on delete cascade,
  blob_url text not null,
  mime text,
  filename text,
  bytes bigint,
  source text not null check (source in ('inbound', 'generated')),
  job_id uuid references public.doedtc_browser_jobs(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists doedtc_files_user_id_created_at_idx
  on public.doedtc_files (user_id, created_at desc);
