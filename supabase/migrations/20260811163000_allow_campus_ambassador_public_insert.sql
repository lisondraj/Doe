create policy "Allow public insert on campus ambassador applications"
  on public.campus_ambassador_applications
  for insert
  to anon, authenticated
  with check (true);
