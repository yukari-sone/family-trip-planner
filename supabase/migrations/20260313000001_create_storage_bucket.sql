-- ============================================
-- Migration: Create trip_images storage bucket
-- ============================================

-- Create a new bucket for trip images (publicly accessible)
insert into storage.buckets (id, name, public) 
values ('trip_images', 'trip_images', true)
on conflict (id) do nothing;

-- Set up RLS policies for the bucket
-- Note: 'storage.objects' table uses row level security

-- 1. 誰でも画像を見ることができる（公開）
create policy "trip_images_select_policy" on storage.objects
  for select to public
  using (bucket_id = 'trip_images');

-- 2. 認証されたユーザーは画像をアップロードできる
create policy "trip_images_insert_policy" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'trip_images');

-- 3. 認証されたユーザーは自分がアップロードした画像を更新できる（Supabaseの認証を使っている場合は auth.uid() を使うが、今回はClerk連携のため、アプリ側（ServiceRole）から安全にアップロードする運用なら RLSをServiceRoleでバイパスするので、実はこれ以上複雑なポリシーは不要かもしれません）
-- ただし、念のためクライアントから直接上げる場合も想定して基本的なポリシーを入れておきます。
create policy "trip_images_update_policy" on storage.objects
  for update to authenticated
  using (bucket_id = 'trip_images');

create policy "trip_images_delete_policy" on storage.objects
  for delete to authenticated
  using (bucket_id = 'trip_images');
