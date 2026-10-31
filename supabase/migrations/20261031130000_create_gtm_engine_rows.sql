-- /GTMENGINE: the GTM team's prospect tables (clinics, multi-site groups, hospital LOIs, programs, non-health services).
-- Every table shares this one: `table_key` names the table, `data` holds its columns by key (see lib/gtm-engine/gtm-tables.ts),
-- and every row carries the date it was entered under (rows group by it, newest first), the page link and the outreach
-- status. Written only through the Next.js API (app/api/gtm-engine/rows) with the service role key; anon/authenticated
-- clients have no direct access.

create table if not exists public.gtm_engine_rows (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  table_key text not null check (
    table_key in ('clinics_us', 'clinics_ca', 'clinics_other', 'multi_site', 'hospital_loi', 'programs', 'services')
  ),
  entry_date date not null default current_date,
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  page text check (page is null or char_length(page) <= 1000),
  status text check (status is null or status in ('Sent', 'Generated', 'Claimed', 'Purchased'))
);

create index if not exists gtm_engine_rows_table_date_idx
  on public.gtm_engine_rows (table_key, entry_date desc, created_at);

create or replace function public.gtm_engine_rows_touch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists gtm_engine_rows_touch on public.gtm_engine_rows;
create trigger gtm_engine_rows_touch
  before update on public.gtm_engine_rows
  for each row execute function public.gtm_engine_rows_touch();

alter table public.gtm_engine_rows enable row level security;

revoke all on table public.gtm_engine_rows from anon, authenticated;
