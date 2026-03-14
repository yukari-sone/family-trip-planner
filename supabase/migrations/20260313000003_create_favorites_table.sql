-- ============================================
-- Migration: Create favorites table
-- ============================================

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  trip_id uuid not null references public.trips(id) on delete cascade,
  created_at timestamptz default now() not null,
  unique(user_id, trip_id)
);
comment on table public.favorites is 'ユーザーのお気に入り（ブックマーク）した旅行プランを管理';

alter table public.favorites enable row level security;

-- SELECT: 自分のものだけ見れる
create policy "favorites_select_policy" on public.favorites
  for select to authenticated, anon
  using (user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub'));

-- INSERT: 自分のものを追加できる
create policy "favorites_insert_policy" on public.favorites
  for insert to authenticated
  with check (user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub'));

-- DELETE: 自分のものを削除できる
create policy "favorites_delete_policy" on public.favorites
  for delete to authenticated
  using (user_id = (select id from public.users where clerk_user_id = auth.jwt() ->> 'sub'));

create index idx_favorites_user_id on public.favorites(user_id);
create index idx_favorites_trip_id on public.favorites(trip_id);
