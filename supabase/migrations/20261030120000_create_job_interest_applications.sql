-- /jobs indications of interest: people asking to be considered as Doe hires its founding team. Written only through
-- the Next.js API (app/api/jobs/apply) with the service role key; anon/authenticated clients have no direct access.
-- Resumes go to the private `job-interest-resumes` bucket, read only with the service role.

create table if not exists public.job_interest_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null check (char_length(full_name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  phone text check (phone is null or char_length(phone) <= 60),
  location text not null check (char_length(location) between 1 and 200),
  role_slug text not null check (char_length(role_slug) between 1 and 120),
  role_title text not null check (char_length(role_title) between 1 and 200),
  start_timing text not null check (char_length(start_timing) between 1 and 80),
  work_authorization text not null check (char_length(work_authorization) between 1 and 80),
  linkedin_url text check (linkedin_url is null or char_length(linkedin_url) <= 500),
  github_url text check (github_url is null or char_length(github_url) <= 500),
  portfolio_url text check (portfolio_url is null or char_length(portfolio_url) <= 500),
  note text not null check (char_length(note) between 1 and 4000),
  resume_storage_path text,
  resume_file_name text,
  source_path text,
  email_sent_at timestamptz
);

create index if not exists job_interest_applications_created_at_idx
  on public.job_interest_applications (created_at desc);

create index if not exists job_interest_applications_email_idx
  on public.job_interest_applications (lower(email));

alter table public.job_interest_applications enable row level security;

revoke all on table public.job_interest_applications from anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'job-interest-resumes',
  'job-interest-resumes',
  false,
  10485760,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
