alter table public.doedtc_artifacts
  add column if not exists layout text not null default 'log'
    check (layout in ('log', 'series', 'counter', 'checklist', 'score')),
  add column if not exists blocks jsonb not null default '[]'::jsonb,
  add column if not exists share_token text,
  add column if not exists shared_at timestamptz,
  add column if not exists goal numeric;

create unique index if not exists doedtc_artifacts_share_token_idx
  on public.doedtc_artifacts (share_token)
  where share_token is not null;
