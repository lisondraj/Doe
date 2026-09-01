alter table public.doedtc_workflows
  drop constraint if exists doedtc_workflows_phase_check;

alter table public.doedtc_workflows
  add constraint doedtc_workflows_phase_check
  check (phase in ('scheduled', 'awaiting_reply', 'waiting_until'));

create index if not exists doedtc_workflows_waiting_until_idx
  on public.doedtc_workflows (next_run_at)
  where status = 'active' and phase = 'waiting_until';
