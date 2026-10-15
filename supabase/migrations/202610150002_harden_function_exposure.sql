create schema if not exists private;

revoke all on schema private from public, anon, authenticated;
grant usage on schema private to anon, authenticated;

alter function public.has_staff_role(public.staff_role[]) set schema private;
revoke all on function private.has_staff_role(public.staff_role[])
  from public, anon, authenticated;
grant execute on function private.has_staff_role(public.staff_role[])
  to anon, authenticated;

alter function public.record_inquiry_event() set schema private;
revoke all on function private.record_inquiry_event()
  from public, anon, authenticated;
