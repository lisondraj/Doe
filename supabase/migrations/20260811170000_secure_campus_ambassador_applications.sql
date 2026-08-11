-- Campus ambassador applications are written only through the Next.js API using
-- the service role key. Direct PostgREST access from anon/authenticated clients
-- must remain blocked.

drop policy if exists "Allow public insert on campus ambassador applications"
  on public.campus_ambassador_applications;

revoke all on table public.campus_ambassador_applications from anon, authenticated;
