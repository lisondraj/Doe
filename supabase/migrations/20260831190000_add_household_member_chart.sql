alter table public.doedtc_household_members
  add column if not exists medications text[] not null default '{}'::text[];

alter table public.doedtc_household_members
  add column if not exists conditions text[] not null default '{}'::text[];
