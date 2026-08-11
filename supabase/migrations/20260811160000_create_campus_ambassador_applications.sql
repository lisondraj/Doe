create table if not exists public.campus_ambassador_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  country text not null check (country in ('us', 'canada')),
  state_or_province text not null,
  school_level text not null check (
    school_level in ('high-school', 'college', 'university', 'graduated', 'other')
  ),
  school_level_other text,
  year_of_study text check (
    year_of_study is null
    or year_of_study in ('year-1', 'year-2', 'year-3', 'year-4', 'year-5-plus', 'other')
  ),
  year_of_study_other text,
  field_of_study text not null,
  health_programs text[] not null default '{}',
  health_program_other text,
  statements text[] not null default '{}',
  linkedin_url text not null
);

create index if not exists campus_ambassador_applications_created_at_idx
  on public.campus_ambassador_applications (created_at desc);

create index if not exists campus_ambassador_applications_email_idx
  on public.campus_ambassador_applications (email);

alter table public.campus_ambassador_applications enable row level security;
