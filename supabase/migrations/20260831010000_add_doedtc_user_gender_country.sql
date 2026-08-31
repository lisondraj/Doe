alter table public.doedtc_users
  add column if not exists gender text,
  add column if not exists country text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'doedtc_users_gender_check'
  ) then
    alter table public.doedtc_users
      add constraint doedtc_users_gender_check
      check (gender is null or gender in ('female', 'male', 'nonbinary', 'prefer_not'));
  end if;
end $$;
