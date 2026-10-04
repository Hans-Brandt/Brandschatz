alter table public.reservations
  alter column customer_email drop not null;

create table public.staff_members (
  email text primary key check (email = lower(trim(email))),
  display_name text not null check (char_length(trim(display_name)) between 2 and 120),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.staff_members enable row level security;
revoke all on table public.staff_members from anon, authenticated;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.staff_members staff
    where staff.email = lower(auth.jwt() ->> 'email')
      and staff.active
  );
$$;

revoke all on function public.is_staff() from public;
grant execute on function public.is_staff() to authenticated;

grant select, insert, update on table public.cafe_tables to authenticated;
grant select, insert, update on table public.reservations to authenticated;
grant select, insert, update on table public.blocked_slots to authenticated;
grant select, insert, update on table public.service_exceptions to authenticated;
grant select, update on table public.service_settings to authenticated;
grant usage, select on all sequences in schema public to authenticated;

create policy "staff can read tables"
  on public.cafe_tables for select to authenticated
  using (public.is_staff());
create policy "staff can maintain tables"
  on public.cafe_tables for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "staff can maintain reservations"
  on public.reservations for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "staff can maintain blocked slots"
  on public.blocked_slots for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "staff can maintain service exceptions"
  on public.service_exceptions for all to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "staff can read service settings"
  on public.service_settings for select to authenticated
  using (public.is_staff());
create policy "staff can update service settings"
  on public.service_settings for update to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create or replace function public.staff_create_reservation(
  p_area text,
  p_date date,
  p_time time,
  p_guests integer,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_note text default null
)
returns table (reservation_id uuid, assigned_table text)
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_created record;
  v_email text := nullif(lower(trim(coalesce(p_customer_email, ''))), '');
begin
  if not public.is_staff() then
    raise exception 'staff_access_required' using errcode = '42501';
  end if;

  if v_email is not null
    and v_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' then
    raise exception 'invalid_email' using errcode = '22023';
  end if;

  select * into v_created
  from public.create_reservation(
    p_area,
    p_date,
    p_time,
    p_guests,
    p_customer_name,
    coalesce(v_email, 'telefon@brandtschatz.invalid'),
    p_customer_phone,
    p_note
  );

  update public.reservations
  set source = 'phone',
      status = 'confirmed',
      customer_email = v_email,
      updated_at = now()
  where id = v_created.reservation_id;

  return query
  select v_created.reservation_id, tables.name
  from public.reservations reservation
  join public.cafe_tables tables on tables.id = reservation.table_id
  where reservation.id = v_created.reservation_id;
end;
$$;

revoke all on function public.staff_create_reservation(text, date, time, integer, text, text, text, text) from public;
grant execute on function public.staff_create_reservation(text, date, time, integer, text, text, text, text) to authenticated;

comment on table public.staff_members is
  'Freigabeliste für Mitarbeitende, die die interne Reservierungsverwaltung verwenden dürfen.';
