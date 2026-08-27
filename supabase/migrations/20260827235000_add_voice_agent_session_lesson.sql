alter table public.voice_agent_sessions
  add column if not exists lesson jsonb;
