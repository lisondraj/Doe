create table if not exists public.doedtc_symptoms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.doedtc_users (id) on delete cascade,
  reported_at timestamptz not null default now(),
  raw_text text not null,
  summary text,
  severity text not null default 'unknown'
    check (severity in ('mild', 'moderate', 'severe', 'unknown')),
  onset text,
  tags text[] not null default '{}',
  assessment_id uuid references public.doedtc_assessments (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists doedtc_symptoms_user_id_idx
  on public.doedtc_symptoms (user_id, reported_at desc);

create index if not exists doedtc_symptoms_assessment_id_idx
  on public.doedtc_symptoms (assessment_id)
  where assessment_id is not null;

alter table public.doedtc_symptoms enable row level security;

revoke all on public.doedtc_symptoms from anon, authenticated;
