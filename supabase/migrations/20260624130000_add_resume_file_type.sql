alter table public.internship_applications
  add column if not exists resume_file_type text;
