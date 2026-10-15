create extension if not exists pgcrypto with schema extensions;

create type public.staff_role as enum ('admin', 'content_editor', 'inquiry_manager');
create type public.service_category as enum (
  'residential',
  'commercial',
  'deep',
  'move_in'
);
create type public.content_status as enum ('draft', 'published', 'archived');
create type public.inquiry_status as enum (
  'new',
  'contacted',
  'quoted',
  'scheduled',
  'closed'
);
create type public.faq_action as enum ('quote', 'contact', 'end');

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.staff_roles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role public.staff_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.has_staff_role(allowed_roles public.staff_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.staff_roles
    where user_id = (select auth.uid())
      and role = any (allowed_roles)
  );
$$;

revoke all on function public.has_staff_role(public.staff_role[]) from public;
grant execute on function public.has_staff_role(public.staff_role[]) to anon, authenticated;

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category public.service_category not null,
  title text not null check (length(trim(title)) between 1 and 120),
  summary text not null check (length(trim(summary)) between 1 and 300),
  description text not null check (length(trim(description)) between 1 and 10000),
  inclusions jsonb not null default '[]'::jsonb
    check (jsonb_typeof(inclusions) = 'array'),
  exclusions jsonb not null default '[]'::jsonb
    check (jsonb_typeof(exclusions) = 'array'),
  pricing_display text check (
    pricing_display is null or length(trim(pricing_display)) <= 300
  ),
  image_path text,
  image_alt text check (image_alt is null or length(trim(image_alt)) <= 300),
  sort_order integer not null default 0,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.page_content (
  id uuid primary key default gen_random_uuid(),
  route text not null check (route ~ '^/[a-z0-9/-]*$'),
  section_key text not null check (section_key ~ '^[a-z0-9_-]+$'),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  status public.content_status not null default 'draft',
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (route, section_key)
);

create table public.site_settings (
  key text primary key check (key ~ '^[a-z0-9_-]+$'),
  value jsonb not null,
  is_public boolean not null default false,
  updated_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.service_areas (
  id uuid primary key default gen_random_uuid(),
  city text not null check (length(trim(city)) between 1 and 120),
  state text not null check (length(trim(state)) between 2 and 80),
  postal_codes text[] not null default '{}',
  map_url text check (map_url is null or map_url ~ '^https://'),
  sort_order integer not null default 0,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services (id) on delete set null,
  service_slug_snapshot text check (
    service_slug_snapshot is null or length(service_slug_snapshot) <= 100
  ),
  customer_name text not null check (
    length(trim(customer_name)) between 1 and 160
  ),
  email text not null check (
    length(email) <= 320
    and email = lower(email)
    and email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
  ),
  phone text check (phone is null or length(trim(phone)) <= 40),
  city text check (city is null or length(trim(city)) <= 120),
  state text check (state is null or length(trim(state)) <= 80),
  postal_code text check (postal_code is null or length(trim(postal_code)) <= 20),
  property_type text check (property_type is null or length(trim(property_type)) <= 80),
  size_or_room_count text check (
    size_or_room_count is null or length(trim(size_or_room_count)) <= 80
  ),
  preferred_date date,
  message text check (message is null or length(message) <= 4000),
  privacy_notice_version text not null check (
    length(trim(privacy_notice_version)) between 1 and 40
  ),
  status public.inquiry_status not null default 'new',
  staff_notes text check (staff_notes is null or length(staff_notes) <= 8000),
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.capture_published_service_slug()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.service_id is null then
    new.service_slug_snapshot = null;
    return new;
  end if;

  select slug
  into new.service_slug_snapshot
  from public.services
  where id = new.service_id
    and status = 'published';

  if new.service_slug_snapshot is null then
    raise exception 'Selected service is not available'
      using errcode = '23503';
  end if;

  return new;
end;
$$;

revoke all on function public.capture_published_service_slug() from public;

create trigger inquiries_capture_service_slug
  before insert on public.inquiries
  for each row execute function public.capture_published_service_slug();

create index inquiries_status_created_at_idx
  on public.inquiries (status, created_at desc);
create index inquiries_service_created_at_idx
  on public.inquiries (service_id, created_at desc);
create index services_published_order_idx
  on public.services (sort_order, title)
  where status = 'published';
create index page_content_published_route_idx
  on public.page_content (route, section_key)
  where status = 'published';
create index service_areas_active_order_idx
  on public.service_areas (sort_order, city, state)
  where is_active;

create table public.faq_nodes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  prompt text not null check (length(trim(prompt)) between 1 and 300),
  is_root boolean not null default false,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index faq_nodes_one_published_root_idx
  on public.faq_nodes (is_root)
  where is_root and status = 'published';

create table public.faq_options (
  id uuid primary key default gen_random_uuid(),
  node_id uuid not null references public.faq_nodes (id) on delete cascade,
  label text not null check (length(trim(label)) between 1 and 160),
  answer text not null check (length(trim(answer)) between 1 and 4000),
  next_node_id uuid references public.faq_nodes (id) on delete set null,
  action public.faq_action,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (num_nonnulls(next_node_id, action) = 1)
);

create index faq_options_node_order_idx on public.faq_options (node_id, sort_order);

create table public.inquiry_events (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries (id) on delete cascade,
  actor_id uuid references auth.users (id) on delete set null,
  event_type text not null check (
    event_type in ('created', 'status_changed', 'note_updated')
  ),
  old_status public.inquiry_status,
  new_status public.inquiry_status,
  created_at timestamptz not null default now()
);

create index inquiry_events_inquiry_created_idx
  on public.inquiry_events (inquiry_id, created_at desc);

create trigger staff_roles_set_updated_at
  before update on public.staff_roles
  for each row execute function public.set_updated_at();
create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();
create trigger page_content_set_updated_at
  before update on public.page_content
  for each row execute function public.set_updated_at();
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();
create trigger service_areas_set_updated_at
  before update on public.service_areas
  for each row execute function public.set_updated_at();
create trigger inquiries_set_updated_at
  before update on public.inquiries
  for each row execute function public.set_updated_at();
create trigger faq_nodes_set_updated_at
  before update on public.faq_nodes
  for each row execute function public.set_updated_at();
create trigger faq_options_set_updated_at
  before update on public.faq_options
  for each row execute function public.set_updated_at();

create function public.record_inquiry_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.inquiry_events (inquiry_id, event_type, new_status)
    values (new.id, 'created', new.status);
  elsif new.status is distinct from old.status then
    insert into public.inquiry_events (
      inquiry_id,
      actor_id,
      event_type,
      old_status,
      new_status
    )
    values (
      new.id,
      (select auth.uid()),
      'status_changed',
      old.status,
      new.status
    );
  elsif new.staff_notes is distinct from old.staff_notes then
    insert into public.inquiry_events (inquiry_id, actor_id, event_type)
    values (new.id, (select auth.uid()), 'note_updated');
  end if;

  return new;
end;
$$;

revoke all on function public.record_inquiry_event() from public;

create trigger inquiries_record_event
  after insert or update of status, staff_notes on public.inquiries
  for each row execute function public.record_inquiry_event();

alter table public.staff_roles enable row level security;
alter table public.services enable row level security;
alter table public.page_content enable row level security;
alter table public.site_settings enable row level security;
alter table public.service_areas enable row level security;
alter table public.inquiries enable row level security;
alter table public.faq_nodes enable row level security;
alter table public.faq_options enable row level security;
alter table public.inquiry_events enable row level security;

create policy "Staff can read own role or admins can read all roles"
  on public.staff_roles for select to authenticated
  using (
    user_id = (select auth.uid())
    or (select public.has_staff_role(array['admin']::public.staff_role[]))
  );
create policy "Admins can add staff roles"
  on public.staff_roles for insert to authenticated
  with check ((select public.has_staff_role(array['admin']::public.staff_role[])));
create policy "Admins can update staff roles"
  on public.staff_roles for update to authenticated
  using ((select public.has_staff_role(array['admin']::public.staff_role[])))
  with check ((select public.has_staff_role(array['admin']::public.staff_role[])));
create policy "Admins can remove staff roles"
  on public.staff_roles for delete to authenticated
  using ((select public.has_staff_role(array['admin']::public.staff_role[])));

create policy "Anyone can read published services"
  on public.services for select to anon, authenticated
  using (
    status = 'published'
    or (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  );
create policy "Editors can add services"
  on public.services for insert to authenticated
  with check (
    (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  );
create policy "Editors can update services"
  on public.services for update to authenticated
  using (
    (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  )
  with check (
    (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  );
create policy "Admins can delete services"
  on public.services for delete to authenticated
  using ((select public.has_staff_role(array['admin']::public.staff_role[])));

create policy "Anyone can read published page content"
  on public.page_content for select to anon, authenticated
  using (
    status = 'published'
    or (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  );
create policy "Editors can add page content"
  on public.page_content for insert to authenticated
  with check (
    (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  );
create policy "Editors can update page content"
  on public.page_content for update to authenticated
  using (
    (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  )
  with check (
    (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  );
create policy "Admins can delete page content"
  on public.page_content for delete to authenticated
  using ((select public.has_staff_role(array['admin']::public.staff_role[])));

create policy "Anyone can read public site settings"
  on public.site_settings for select to anon, authenticated
  using (
    is_public
    or (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  );
create policy "Editors can add site settings"
  on public.site_settings for insert to authenticated
  with check (
    (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  );
create policy "Editors can update site settings"
  on public.site_settings for update to authenticated
  using (
    (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  )
  with check (
    (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  );
create policy "Admins can delete site settings"
  on public.site_settings for delete to authenticated
  using ((select public.has_staff_role(array['admin']::public.staff_role[])));

create policy "Anyone can read active service areas"
  on public.service_areas for select to anon, authenticated
  using (
    is_active
    or (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  );
create policy "Editors can add service areas"
  on public.service_areas for insert to authenticated
  with check (
    (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  );
create policy "Editors can update service areas"
  on public.service_areas for update to authenticated
  using (
    (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  )
  with check (
    (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  );
create policy "Admins can delete service areas"
  on public.service_areas for delete to authenticated
  using ((select public.has_staff_role(array['admin']::public.staff_role[])));

create policy "Inquiry managers can read inquiries"
  on public.inquiries for select to authenticated
  using (
    (select public.has_staff_role(array['admin', 'inquiry_manager']::public.staff_role[]))
  );
create policy "Editors and inquiry managers can insert inquiries"
  on public.inquiries for insert to authenticated
  with check (
    (select public.has_staff_role(
      array['admin', 'inquiry_manager', 'content_editor']::public.staff_role[]
    ))
  );
create policy "Inquiry managers can update inquiries"
  on public.inquiries for update to authenticated
  using (
    (select public.has_staff_role(array['admin', 'inquiry_manager']::public.staff_role[]))
  )
  with check (
    (select public.has_staff_role(array['admin', 'inquiry_manager']::public.staff_role[]))
  );
create policy "Public may only create a new inquiry"
  on public.inquiries for insert to anon
  with check (
    status = 'new'
    and staff_notes is null
    and updated_by is null
    and updated_at = created_at
    and (
      service_id is null
      or exists (
        select 1
        from public.services
        where services.id = inquiries.service_id
          and services.status = 'published'
      )
    )
  );

create policy "Anyone can read nodes in the published FAQ"
  on public.faq_nodes for select to anon, authenticated
  using (
    status = 'published'
    or (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  );
create policy "Editors can add FAQ nodes"
  on public.faq_nodes for insert to authenticated
  with check (
    (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  );
create policy "Editors can update FAQ nodes"
  on public.faq_nodes for update to authenticated
  using (
    (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  )
  with check (
    (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  );
create policy "Admins can delete FAQ nodes"
  on public.faq_nodes for delete to authenticated
  using ((select public.has_staff_role(array['admin']::public.staff_role[])));

create policy "Anyone can read options for published FAQ nodes"
  on public.faq_options for select to anon, authenticated
  using (
    exists (
      select 1
      from public.faq_nodes
      where faq_nodes.id = faq_options.node_id
        and faq_nodes.status = 'published'
    )
    or (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  );
create policy "Editors can add FAQ options"
  on public.faq_options for insert to authenticated
  with check (
    (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  );
create policy "Editors can update FAQ options"
  on public.faq_options for update to authenticated
  using (
    (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  )
  with check (
    (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  );
create policy "Admins can delete FAQ options"
  on public.faq_options for delete to authenticated
  using ((select public.has_staff_role(array['admin']::public.staff_role[])));

create policy "Inquiry managers can read inquiry events"
  on public.inquiry_events for select to authenticated
  using (
    (select public.has_staff_role(array['admin', 'inquiry_manager']::public.staff_role[]))
  );

revoke all on all tables in schema public from public, anon, authenticated;
grant usage on schema public to anon, authenticated;
grant execute on function public.set_updated_at() to authenticated;
grant select on
  public.services,
  public.page_content,
  public.site_settings,
  public.service_areas,
  public.faq_nodes,
  public.faq_options
to anon, authenticated;
grant insert, update, delete on
  public.services,
  public.page_content,
  public.site_settings,
  public.service_areas,
  public.faq_nodes,
  public.faq_options
to authenticated;
grant select, insert, update, delete on public.staff_roles to authenticated;
grant select on public.inquiries to authenticated;
grant update (status, staff_notes, updated_by)
  on public.inquiries to authenticated;
grant insert (
  service_id,
  customer_name,
  email,
  phone,
  city,
  state,
  postal_code,
  property_type,
  size_or_room_count,
  preferred_date,
  message,
  privacy_notice_version
) on public.inquiries to anon, authenticated;
grant select on public.inquiry_events to authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'site-media',
  'site-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public can read site media"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'site-media');
create policy "Content editors can upload site media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'site-media'
    and (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  );
create policy "Content editors can update site media"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'site-media'
    and (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  )
  with check (
    bucket_id = 'site-media'
    and (select public.has_staff_role(array['admin', 'content_editor']::public.staff_role[]))
  );
create policy "Admins can delete site media"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'site-media'
    and (select public.has_staff_role(array['admin']::public.staff_role[]))
  );
