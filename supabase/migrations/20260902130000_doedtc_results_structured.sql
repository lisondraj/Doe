alter table public.doedtc_results
  add column if not exists value text,
  add column if not exists unit text,
  add column if not exists reference_range text,
  add column if not exists flag text check (flag in ('high', 'low'));
