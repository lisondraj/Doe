-- /jobs no longer asks for work authorization; older rows keep theirs.
alter table public.job_interest_applications
  drop constraint if exists job_interest_applications_work_authorization_check;
alter table public.job_interest_applications
  alter column work_authorization drop not null;
alter table public.job_interest_applications
  add constraint job_interest_applications_work_authorization_check
  check (work_authorization is null or char_length(work_authorization) <= 80);
