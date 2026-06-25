create table if not exists public.internship_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  country text not null check (country in ('canada', 'us')),
  education text not null check (education in ('highschool', 'university', 'graduated')),
  school_name text not null,
  program_of_study text not null,
  areas text[] not null default '{}',
  resume_storage_path text,
  resume_file_name text,
  linkedin_username text,
  additional_notes text,
  email_sent_at timestamptz
);

create index if not exists internship_applications_created_at_idx
  on public.internship_applications (created_at desc);

create index if not exists internship_applications_email_idx
  on public.internship_applications (email);

alter table public.internship_applications enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'internship-resumes',
  'internship-resumes',
  false,
  10485760,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
