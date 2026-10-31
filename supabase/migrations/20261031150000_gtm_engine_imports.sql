-- /GTMENGINE bulk import: each row keeps its report (edition) date apart from the date it was entered, a duplicate key
-- (organization-level for clinics, multi-site groups, programs and services; person + organization for hospital
-- contacts; see lib/gtm-engine/gtm-tables.ts) and the import batch it came in with, so one batch can be undone. Each
-- batch is logged in gtm_engine_imports with its totals. Both tables are written only through the Next.js API with the
-- service role key; anon/authenticated clients have no direct access.

alter table public.gtm_engine_rows
  add column if not exists report_date date,
  add column if not exists dedupe_key text check (dedupe_key is null or char_length(dedupe_key) <= 600),
  add column if not exists import_batch uuid;

create index if not exists gtm_engine_rows_dedupe_idx
  on public.gtm_engine_rows (table_key, dedupe_key);

create index if not exists gtm_engine_rows_batch_idx
  on public.gtm_engine_rows (import_batch)
  where import_batch is not null;

create table if not exists public.gtm_engine_imports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  table_key text not null check (
    table_key in ('clinics_us', 'clinics_ca', 'clinics_other', 'multi_site', 'hospital_loi', 'programs', 'services')
  ),
  source text not null check (source in ('page', 'api')),
  format text check (format is null or char_length(format) <= 20),
  report_date date,
  entry_date date not null,
  accepted integer not null default 0 check (accepted >= 0),
  skipped integer not null default 0 check (skipped >= 0),
  errors integer not null default 0 check (errors >= 0),
  undone_at timestamptz
);

create index if not exists gtm_engine_imports_table_created_idx
  on public.gtm_engine_imports (table_key, created_at desc);

alter table public.gtm_engine_imports enable row level security;

revoke all on table public.gtm_engine_imports from anon, authenticated;
