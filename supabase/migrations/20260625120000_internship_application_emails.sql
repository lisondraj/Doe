create table if not exists public.internship_application_emails (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.internship_applications (id) on delete cascade,
  sent_at timestamptz not null default now(),
  recipient_email text not null,
  trigger text not null check (trigger in ('initial', 'admin_resend')),
  status text not null check (status in ('sent', 'failed')),
  resend_message_id text,
  error_message text
);

create index if not exists internship_application_emails_application_sent_idx
  on public.internship_application_emails (application_id, sent_at desc);

alter table public.internship_application_emails enable row level security;

insert into public.internship_application_emails (
  application_id,
  sent_at,
  recipient_email,
  trigger,
  status
)
select
  id,
  email_sent_at,
  email,
  'initial',
  'sent'
from public.internship_applications
where email_sent_at is not null
on conflict do nothing;
