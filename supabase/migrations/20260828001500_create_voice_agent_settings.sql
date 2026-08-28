create table if not exists public.voice_agent_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  voice text not null default 'marin',
  speed numeric not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.voice_agent_settings enable row level security;

revoke all on public.voice_agent_settings from anon, public;

grant select, insert, update on public.voice_agent_settings to authenticated;

create policy "Users can read own voice agent settings"
  on public.voice_agent_settings
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert own voice agent settings"
  on public.voice_agent_settings
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can update own voice agent settings"
  on public.voice_agent_settings
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
