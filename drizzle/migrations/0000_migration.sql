
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  type text not null check (type in ('lost','found','sighting')),
  species text not null check (species in ('dog','cat','other')),
  pet_name text not null check (char_length(pet_name) between 1 and 60),
  description text not null default '' check (char_length(description) <= 1500),
  area text not null check (char_length(area) between 1 and 80),
  lat double precision not null,
  lng double precision not null,
  event_date date not null default current_date,
  urgency text not null default 'medium' check (urgency in ('low','medium','high','critical')),
  status text not null default 'active' check (status in ('pending','active','reunited')),
  photos text[] not null default '{}',
  author_name text not null default '',
  linked_report_id uuid references public.reports(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.reports to anon;
grant select, insert, update, delete on public.reports to authenticated;
grant all on public.reports to service_role;
alter table public.reports enable row level security;
create policy "reports public read" on public.reports for select to anon, authenticated using (true);
create policy "reports own insert" on public.reports for insert to authenticated with check (auth.uid() = owner_id);
create policy "reports own update" on public.reports for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "reports own delete" on public.reports for delete to authenticated using (auth.uid() = owner_id);
create index reports_created_idx on public.reports(created_at desc);

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;
create trigger reports_touch before update on public.reports for each row execute function public.touch_updated_at();

-- Private contact data: only owner can read directly
create table public.report_contacts (
  report_id uuid primary key references public.reports(id) on delete cascade,
  owner_id uuid not null default auth.uid(),
  phone text check (phone is null or char_length(phone) <= 30),
  email text check (email is null or char_length(email) <= 255),
  share_phone boolean not null default false,
  share_email boolean not null default false
);
grant select, insert, update, delete on public.report_contacts to authenticated;
grant all on public.report_contacts to service_role;
alter table public.report_contacts enable row level security;
create policy "contacts own all" on public.report_contacts for all to authenticated
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id and exists (select 1 from public.reports r where r.id = report_id and r.owner_id = auth.uid()));

-- Returns only what the owner authorized, only for signed-in users
create or replace function public.get_report_contact(_report_id uuid)
returns table (phone text, email text)
language sql stable security definer set search_path = public as $$
  select case when c.share_phone then c.phone end, case when c.share_email then c.email end
  from public.report_contacts c
  where c.report_id = _report_id and auth.uid() is not null
$$;
revoke all on function public.get_report_contact(uuid) from public, anon;
grant execute on function public.get_report_contact(uuid) to authenticated;

create table public.report_messages (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  sender_id uuid not null default auth.uid(),
  sender_name text not null default '',
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);
grant select, insert on public.report_messages to authenticated;
grant all on public.report_messages to service_role;
alter table public.report_messages enable row level security;
create policy "messages insert self" on public.report_messages for insert to authenticated with check (auth.uid() = sender_id);
create policy "messages read sender or owner" on public.report_messages for select to authenticated
  using (auth.uid() = sender_id or exists (select 1 from public.reports r where r.id = report_id and r.owner_id = auth.uid()));

-- Storage policies for report-photos bucket
create policy "report photos public read" on storage.objects for select using (bucket_id = 'report-photos');
create policy "report photos own upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'report-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "report photos own delete" on storage.objects for delete to authenticated
  using (bucket_id = 'report-photos' and (storage.foldername(name))[1] = auth.uid()::text);
