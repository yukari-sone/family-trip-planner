-- ============================================
-- Migration: 初期スキーマ作成
-- Purpose: FamilyTrip Planner の基本テーブル構造を作成
-- Tables: users, trips, trip_spots
-- ============================================

-- ============================================
-- 1. USERS テーブル
-- ============================================
create table public.users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  email text not null,
  display_name varchar(100) not null,
  avatar_url text,
  family_info jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
comment on table public.users is 'アプリケーションのユーザー情報とプロファイルを管理';

-- RLS の有効化
alter table public.users enable row level security;

-- RLS ポリシー: SELECT (全員がプロフィールを参照可能)
create policy "users_select_all" on public.users
  for select to authenticated, anon
  using (true);

-- RLS ポリシー: INSERT (Service Role経由で挿入されるため、通常は不要だが、Clerk連携用に追加しておく場合)
create policy "users_insert_own_data" on public.users
  for insert to authenticated
  with check (clerk_user_id = auth.jwt() ->> 'sub');

-- RLS ポリシー: UPDATE (本人のみ更新可能)
create policy "users_update_own_data" on public.users
  for update to authenticated
  using (clerk_user_id = auth.jwt() ->> 'sub')
  with check (clerk_user_id = auth.jwt() ->> 'sub');

-- インデックス
create index idx_users_clerk_user_id on public.users(clerk_user_id);


-- ============================================
-- 2. TRIPS テーブル
-- ============================================
create table public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title varchar(200) not null,
  area varchar(100) not null,
  target_ages varchar(100),
  is_public boolean default false not null,
  movie_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
comment on table public.trips is '旅行プランの全体情報（メタデータ）を管理';

alter table public.trips enable row level security;

-- SELECT: 公開設定なら全員、非公開なら作成者のみ
create policy "trips_select_policy" on public.trips
  for select to authenticated, anon
  using (
    is_public = true 
    or 
    (auth.role() = 'authenticated' and user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub'))
  );

-- INSERT: 認証済みユーザーのみ
create policy "trips_insert_policy" on public.trips
  for insert to authenticated
  with check (user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub'));

-- UPDATE/DELETE: 作成者のみ
create policy "trips_update_policy" on public.trips
  for update to authenticated
  using (user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub'))
  with check (user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub'));

create policy "trips_delete_policy" on public.trips
  for delete to authenticated
  using (user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub'));

create index idx_trips_user_id on public.trips(user_id);
create index idx_trips_is_public on public.trips(is_public);


-- ============================================
-- 3. TRIP_SPOTS テーブル
-- ============================================
create table public.trip_spots (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  place_name varchar(200) not null,
  type varchar(50) default 'spot' not null, -- 'spot' or 'transit'
  icon varchar(50), -- 'train', 'plane', etc
  latitude float8,
  longitude float8,
  start_time time,
  end_time time,
  order_index int4 not null,
  positive_comment text,
  failure_alert text,
  image_url text,
  created_at timestamptz default now() not null
);
comment on table public.trip_spots is '旅程に含まれる個々の目的地や移動手段の情報を管理';

alter table public.trip_spots enable row level security;

-- SELECT: 親のTRIPが参照可能なら参照可能
create policy "trip_spots_select_policy" on public.trip_spots
  for select to authenticated, anon
  using (
    exists (
      select 1 from public.trips 
      where id = trip_spots.trip_id 
      and (
        is_public = true 
        or 
        (auth.role() = 'authenticated' and user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub'))
      )
    )
  );

-- INSERT/UPDATE/DELETE: 親のTRIPの作成者のみ
create policy "trip_spots_insert_policy" on public.trip_spots
  for insert to authenticated
  with check (
    exists (
      select 1 from public.trips 
      where id = trip_spots.trip_id 
      and user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub')
    )
  );

create policy "trip_spots_update_policy" on public.trip_spots
  for update to authenticated
  using (
    exists (
      select 1 from public.trips 
      where id = trip_spots.trip_id 
      and user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub')
    )
  );

create policy "trip_spots_delete_policy" on public.trip_spots
  for delete to authenticated
  using (
    exists (
      select 1 from public.trips 
      where id = trip_spots.trip_id 
      and user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub')
    )
  );

create index idx_trip_spots_trip_id on public.trip_spots(trip_id);
create index idx_trip_spots_order_index on public.trip_spots(order_index);