alter table public.doedtc_household_members
  add column if not exists gender text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'doedtc_household_members_gender_check'
  ) then
    alter table public.doedtc_household_members
      add constraint doedtc_household_members_gender_check
      check (gender is null or gender in ('female', 'male', 'nonbinary', 'prefer_not'));
  end if;
end $$;
