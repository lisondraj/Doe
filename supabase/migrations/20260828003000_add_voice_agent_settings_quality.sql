alter table public.voice_agent_settings
  add column if not exists quality text not null default 'saver';

alter table public.voice_agent_settings
  drop constraint if exists voice_agent_settings_quality_check;

alter table public.voice_agent_settings
  add constraint voice_agent_settings_quality_check
  check (quality in ('full', 'saver'));
