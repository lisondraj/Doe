-- One open browser job per user (race-safe).

drop index if exists public.doedtc_browser_jobs_open_user_idx;

create unique index if not exists doedtc_browser_jobs_open_user_unique_idx
  on public.doedtc_browser_jobs (user_id)
  where status in ('open', 'needs_login', 'pending_confirm');

-- Cancel the stale google.com research job wedging the agent.
update public.doedtc_browser_jobs
set
  status = 'failed',
  outcome = 'auto-cancelled: stale session past kernel timeout',
  updated_at = now()
where id = '7ae64b73-bf0c-4db7-ac3d-e548c370a7f8'
  and status in ('open', 'needs_login', 'pending_confirm');
