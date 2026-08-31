-- Merge duplicate household members, normalize phones, add unique guard.

-- Step 1: merge duplicate members (keep oldest row per household + name).
with ranked as (
  select
    id,
    household_id,
    lower(trim(full_name)) as name_key,
    row_number() over (
      partition by household_id, lower(trim(full_name))
      order by created_at asc, id asc
    ) as rn,
    count(*) over (partition by household_id, lower(trim(full_name))) as copies
  from public.doedtc_household_members
  where role <> 'admin'
),
pairs as (
  select
    keep.id as keep_id,
    dup.id as dup_id
  from ranked keep
  join ranked dup
    on keep.household_id = dup.household_id
   and keep.name_key = dup.name_key
   and keep.rn = 1
   and dup.rn > 1
   and keep.copies > 1
)
update public.doedtc_household_members target
set date_of_birth = coalesce(
  (
    select newer.date_of_birth
    from public.doedtc_household_members newer
    join pairs p on p.dup_id = newer.id
    where p.keep_id = target.id
      and newer.date_of_birth is not null
    order by newer.created_at desc
    limit 1
  ),
  target.date_of_birth
),
phone = coalesce(
  (
    select newer.phone
    from public.doedtc_household_members newer
    join pairs p on p.dup_id = newer.id
    where p.keep_id = target.id
      and newer.phone is not null
    order by newer.created_at desc
    limit 1
  ),
  target.phone
),
gender = coalesce(
  (
    select newer.gender
    from public.doedtc_household_members newer
    join pairs p on p.dup_id = newer.id
    where p.keep_id = target.id
      and newer.gender is not null
    order by newer.created_at desc
    limit 1
  ),
  target.gender
)
where target.id in (select keep_id from pairs);

with ranked as (
  select
    id,
    household_id,
    lower(trim(full_name)) as name_key,
    row_number() over (
      partition by household_id, lower(trim(full_name))
      order by created_at asc, id asc
    ) as rn
  from public.doedtc_household_members
  where role <> 'admin'
)
delete from public.doedtc_household_members m
using ranked r
where m.id = r.id
  and r.rn > 1;

-- Step 2: normalize bare 10-digit phones to E.164 (+1).
update public.doedtc_household_members
set phone = '+1' || regexp_replace(phone, '\D', '', 'g')
where phone is not null
  and phone !~ '^\+[1-9][0-9]{9,14}$'
  and length(regexp_replace(phone, '\D', '', 'g')) = 10;

update public.doedtc_family_members
set phone = '+1' || regexp_replace(phone, '\D', '', 'g')
where phone is not null
  and phone !~ '^\+[1-9][0-9]{9,14}$'
  and length(regexp_replace(phone, '\D', '', 'g')) = 10;

-- Step 3: prevent future duplicate household members by name.
create unique index if not exists doedtc_household_members_household_name_key
  on public.doedtc_household_members (household_id, lower(trim(full_name)));
