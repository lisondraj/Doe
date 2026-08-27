create table if not exists public.voice_agent_sessions (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  mode text not null check (mode in ('practice', 'learn')),
  topic text not null,
  station_type text check (
    station_type is null
    or station_type in ('history', 'physical_exam', 'management_counseling')
  ),
  started_at timestamptz not null,
  ended_at timestamptz not null,
  transcript jsonb not null default '[]'::jsonb,
  advice_transcript jsonb not null default '[]'::jsonb,
  feedback jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists voice_agent_sessions_user_ended_at_idx
  on public.voice_agent_sessions (user_id, ended_at desc);

alter table public.voice_agent_sessions enable row level security;

revoke all on public.voice_agent_sessions from anon, public;

grant select, insert, update, delete on public.voice_agent_sessions to authenticated;

create policy "Users can read own voice agent sessions"
  on public.voice_agent_sessions
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own voice agent sessions"
  on public.voice_agent_sessions
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own voice agent sessions"
  on public.voice_agent_sessions
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete own voice agent sessions"
  on public.voice_agent_sessions
  for delete
  to authenticated
  using (user_id = auth.uid());
