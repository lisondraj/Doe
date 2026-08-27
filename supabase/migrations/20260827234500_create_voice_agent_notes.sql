create table if not exists public.voice_agent_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  topic text not null,
  category text not null check (
    category in ('history', 'physical_exam', 'management_counseling')
  ),
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists voice_agent_notes_user_topic_created_idx
  on public.voice_agent_notes (user_id, topic, created_at desc);

alter table public.voice_agent_notes enable row level security;

revoke all on public.voice_agent_notes from anon, public;

grant select, insert, update, delete on public.voice_agent_notes to authenticated;

create policy "Users can read own voice agent notes"
  on public.voice_agent_notes
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own voice agent notes"
  on public.voice_agent_notes
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own voice agent notes"
  on public.voice_agent_notes
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete own voice agent notes"
  on public.voice_agent_notes
  for delete
  to authenticated
  using (user_id = auth.uid());
