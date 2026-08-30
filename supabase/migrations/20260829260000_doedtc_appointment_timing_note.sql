alter table public.doedtc_appointments
  alter column starts_at drop not null;

alter table public.doedtc_appointments
  add column if not exists timing_note text;

alter table public.doedtc_appointments
  drop constraint if exists doedtc_appointments_timing_check;

alter table public.doedtc_appointments
  add constraint doedtc_appointments_timing_check
  check (starts_at is not null or nullif(trim(timing_note), '') is not null);