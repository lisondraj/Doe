alter table public.doedtc_users drop constraint if exists doedtc_users_status_check;

alter table public.doedtc_users add constraint doedtc_users_status_check
  check (status in ('invited', 'pending_confirm', 'onboarding', 'active', 'opted_out'));
