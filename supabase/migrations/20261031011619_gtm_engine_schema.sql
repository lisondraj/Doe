-- GTM engine CRM tables: companies, contacts, campaigns, leads, sequences, steps, enrollments, deals, activities, tasks.
-- Already applied to the Doe project (tnferryxxngdoprlustj) as migrations gtm_engine_schema + gtm_move_citext_to_extensions.
-- Owner-scoped RLS for signed-in users (owner_id defaults to auth.uid()); the service role bypasses RLS.
-- Separate from public.gtm_engine_rows, which backs the /GTMENGINE prospect tables.

create schema if not exists extensions;
create extension if not exists citext with schema extensions;

create or replace function public.gtm_set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;

create table if not exists public.gtm_companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid default auth.uid() references auth.users(id) on delete set null,
  name text not null,
  domain extensions.citext unique,
  industry text,
  employee_count int,
  annual_revenue numeric,
  country text,
  city text,
  linkedin_url text,
  icp_fit_score int check (icp_fit_score between 0 and 100),
  tier text check (tier in ('tier_1','tier_2','tier_3')),
  enrichment jsonb not null default '{}',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gtm_contacts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid default auth.uid() references auth.users(id) on delete set null,
  company_id uuid references public.gtm_companies(id) on delete set null,
  first_name text,
  last_name text,
  email extensions.citext unique,
  phone text,
  title text,
  seniority text,
  department text,
  linkedin_url text,
  email_status text default 'unknown' check (email_status in ('unknown','valid','invalid','catch_all','bounced')),
  do_not_contact boolean not null default false,
  unsubscribed_at timestamptz,
  enrichment jsonb not null default '{}',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gtm_campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid default auth.uid() references auth.users(id) on delete set null,
  name text not null,
  description text,
  channel text check (channel in ('email','linkedin','phone','sms','multi','ads','event')),
  status text not null default 'draft' check (status in ('draft','active','paused','completed','archived')),
  target_icp jsonb not null default '{}',
  budget numeric,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gtm_leads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid default auth.uid() references auth.users(id) on delete set null,
  contact_id uuid references public.gtm_contacts(id) on delete cascade,
  company_id uuid references public.gtm_companies(id) on delete set null,
  campaign_id uuid references public.gtm_campaigns(id) on delete set null,
  source text,
  status text not null default 'new' check (status in ('new','contacted','engaged','qualified','unqualified','converted','lost')),
  score int not null default 0,
  qualification_notes text,
  converted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gtm_sequences (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid default auth.uid() references auth.users(id) on delete set null,
  campaign_id uuid references public.gtm_campaigns(id) on delete set null,
  name text not null,
  status text not null default 'draft' check (status in ('draft','active','paused','archived')),
  settings jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gtm_sequence_steps (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid default auth.uid() references auth.users(id) on delete set null,
  sequence_id uuid not null references public.gtm_sequences(id) on delete cascade,
  step_order int not null,
  channel text not null check (channel in ('email','linkedin_connect','linkedin_message','call','sms','task')),
  delay_days int not null default 0,
  subject text,
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (sequence_id, step_order)
);

create table if not exists public.gtm_enrollments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid default auth.uid() references auth.users(id) on delete set null,
  sequence_id uuid not null references public.gtm_sequences(id) on delete cascade,
  contact_id uuid not null references public.gtm_contacts(id) on delete cascade,
  lead_id uuid references public.gtm_leads(id) on delete set null,
  status text not null default 'active' check (status in ('active','paused','completed','replied','bounced','unsubscribed','stopped')),
  current_step int not null default 1,
  next_step_at timestamptz,
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (sequence_id, contact_id)
);

create table if not exists public.gtm_deals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid default auth.uid() references auth.users(id) on delete set null,
  company_id uuid references public.gtm_companies(id) on delete set null,
  primary_contact_id uuid references public.gtm_contacts(id) on delete set null,
  lead_id uuid references public.gtm_leads(id) on delete set null,
  name text not null,
  stage text not null default 'discovery' check (stage in ('discovery','qualification','demo','proposal','negotiation','closed_won','closed_lost')),
  amount numeric,
  currency text not null default 'USD',
  probability int check (probability between 0 and 100),
  expected_close_date date,
  closed_at timestamptz,
  lost_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gtm_activities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid default auth.uid() references auth.users(id) on delete set null,
  contact_id uuid references public.gtm_contacts(id) on delete cascade,
  company_id uuid references public.gtm_companies(id) on delete set null,
  deal_id uuid references public.gtm_deals(id) on delete set null,
  enrollment_id uuid references public.gtm_enrollments(id) on delete set null,
  sequence_step_id uuid references public.gtm_sequence_steps(id) on delete set null,
  type text not null check (type in ('email_sent','email_opened','email_clicked','email_replied','email_bounced','call','meeting','linkedin','sms','note','form_fill','web_visit')),
  direction text check (direction in ('inbound','outbound')),
  subject text,
  body text,
  metadata jsonb not null default '{}',
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.gtm_tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid default auth.uid() references auth.users(id) on delete set null,
  contact_id uuid references public.gtm_contacts(id) on delete cascade,
  deal_id uuid references public.gtm_deals(id) on delete cascade,
  title text not null,
  description text,
  type text default 'todo' check (type in ('todo','call','email','linkedin','follow_up','meeting')),
  priority text not null default 'medium' check (priority in ('low','medium','high','urgent')),
  status text not null default 'open' check (status in ('open','in_progress','done','cancelled')),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gtm_companies_owner_id_idx on public.gtm_companies (owner_id);
create index if not exists gtm_contacts_owner_id_idx on public.gtm_contacts (owner_id);
create index if not exists gtm_contacts_company_id_idx on public.gtm_contacts (company_id);
create index if not exists gtm_campaigns_owner_id_idx on public.gtm_campaigns (owner_id);
create index if not exists gtm_leads_owner_id_idx on public.gtm_leads (owner_id);
create index if not exists gtm_leads_contact_id_idx on public.gtm_leads (contact_id);
create index if not exists gtm_leads_company_id_idx on public.gtm_leads (company_id);
create index if not exists gtm_leads_campaign_id_idx on public.gtm_leads (campaign_id);
create index if not exists gtm_leads_status_idx on public.gtm_leads (status);
create index if not exists gtm_sequences_owner_id_idx on public.gtm_sequences (owner_id);
create index if not exists gtm_sequences_campaign_id_idx on public.gtm_sequences (campaign_id);
create index if not exists gtm_sequence_steps_owner_id_idx on public.gtm_sequence_steps (owner_id);
create index if not exists gtm_enrollments_owner_id_idx on public.gtm_enrollments (owner_id);
create index if not exists gtm_enrollments_contact_id_idx on public.gtm_enrollments (contact_id);
create index if not exists gtm_enrollments_lead_id_idx on public.gtm_enrollments (lead_id);
create index if not exists gtm_enrollments_status_next_step_at_idx on public.gtm_enrollments (status, next_step_at);
create index if not exists gtm_deals_owner_id_idx on public.gtm_deals (owner_id);
create index if not exists gtm_deals_company_id_idx on public.gtm_deals (company_id);
create index if not exists gtm_deals_primary_contact_id_idx on public.gtm_deals (primary_contact_id);
create index if not exists gtm_deals_lead_id_idx on public.gtm_deals (lead_id);
create index if not exists gtm_deals_stage_idx on public.gtm_deals (stage);
create index if not exists gtm_activities_owner_id_idx on public.gtm_activities (owner_id);
create index if not exists gtm_activities_contact_id_occurred_at_idx on public.gtm_activities (contact_id, occurred_at desc);
create index if not exists gtm_activities_company_id_idx on public.gtm_activities (company_id);
create index if not exists gtm_activities_deal_id_idx on public.gtm_activities (deal_id);
create index if not exists gtm_activities_enrollment_id_idx on public.gtm_activities (enrollment_id);
create index if not exists gtm_activities_sequence_step_id_idx on public.gtm_activities (sequence_step_id);
create index if not exists gtm_tasks_owner_id_idx on public.gtm_tasks (owner_id);
create index if not exists gtm_tasks_contact_id_idx on public.gtm_tasks (contact_id);
create index if not exists gtm_tasks_deal_id_idx on public.gtm_tasks (deal_id);
create index if not exists gtm_tasks_status_due_at_idx on public.gtm_tasks (status, due_at);

do $$
declare t text;
begin
  foreach t in array array['gtm_companies','gtm_contacts','gtm_campaigns','gtm_leads','gtm_sequences','gtm_sequence_steps','gtm_enrollments','gtm_deals','gtm_tasks'] loop
    execute format('drop trigger if exists %I on public.%I', t || '_updated_at', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.gtm_set_updated_at()', t || '_updated_at', t);
  end loop;
  foreach t in array array['gtm_companies','gtm_contacts','gtm_campaigns','gtm_leads','gtm_sequences','gtm_sequence_steps','gtm_enrollments','gtm_deals','gtm_activities','gtm_tasks'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', t || '_owner_all', t);
    execute format('create policy %I on public.%I for all to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id)', t || '_owner_all', t);
  end loop;
end $$;
