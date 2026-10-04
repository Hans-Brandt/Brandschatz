alter table public.cafe_tables
  add column zone text not null default 'inside'
    check (zone in ('inside', 'terrace', 'garden'));

alter table public.cafe_tables
  add constraint cafe_tables_area_matches_zone_check
  check (
    (area = 'inside' and zone = 'inside')
    or (area = 'outside' and zone in ('terrace', 'garden'))
  );

insert into public.cafe_tables (name, area, zone, seats, sort_order)
select
  'Innen ' || table_number,
  'inside'::public.reservation_area,
  'inside',
  5,
  table_number
from generate_series(1, 8) as table_number;

insert into public.cafe_tables (name, area, zone, seats, sort_order)
values ('Innen 9', 'inside', 'inside', 2, 9);

insert into public.cafe_tables (name, area, zone, seats, sort_order)
select
  'Terrasse ' || table_number,
  'outside'::public.reservation_area,
  'terrace',
  5,
  table_number
from generate_series(1, 4) as table_number;

insert into public.cafe_tables (name, area, zone, seats, sort_order)
select
  'Terrasse ' || table_number,
  'outside'::public.reservation_area,
  'terrace',
  2,
  table_number
from generate_series(5, 7) as table_number;

insert into public.cafe_tables (name, area, zone, seats, sort_order)
select
  'Garten ' || table_number,
  'outside'::public.reservation_area,
  'garden',
  4,
  table_number
from generate_series(1, 10) as table_number;

insert into public.cafe_tables (name, area, zone, seats, sort_order)
select
  'Garten ' || table_number,
  'outside'::public.reservation_area,
  'garden',
  2,
  table_number
from generate_series(11, 13) as table_number;

comment on column public.cafe_tables.zone is
  'Interner Bereich: Innenraum, Terrasse oder Garten. Für Gäste werden Terrasse und Garten als Draußen zusammengefasst.';
