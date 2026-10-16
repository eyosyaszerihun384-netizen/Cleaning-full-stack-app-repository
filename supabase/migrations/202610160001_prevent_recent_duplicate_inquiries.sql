create index inquiries_email_created_at_idx
  on public.inquiries (email, created_at desc);

create or replace function private.reject_recent_duplicate_inquiry()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  normalized_email text := lower(btrim(new.email));
begin
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('public-inquiry-email:' || normalized_email, 0)
  );

  if exists (
    select 1
    from public.inquiries as existing
    where existing.email = normalized_email
      and existing.created_at >= pg_catalog.clock_timestamp() - interval '10 minutes'
  ) then
    raise exception using
      errcode = 'P0001',
      message = 'recent_inquiry_duplicate';
  end if;

  return new;
end;
$$;

revoke all on function private.reject_recent_duplicate_inquiry()
  from public, anon, authenticated;

create trigger inquiries_reject_recent_duplicate
  before insert on public.inquiries
  for each row execute function private.reject_recent_duplicate_inquiry();
