# ✅ Supabase + Clerk 統合完了レポート

実装日: 2026-02-27

## 📦 インストールされたパッケージ

- @clerk/nextjs: ^6.12.1 (latest)
- @supabase/supabase-js: ^2.48.1 (latest)
- @supabase/ssr: ^0.5.2 (latest)

## 🗄️ データベース構造

### 作成されたテーブル
1. `users` - ユーザーの基本情報とプロファイルを管理
2. `trips` - 旅行プランの全体情報（メタデータ）を管理
3. `trip_spots` - 旅程に含まれる個々の目的地や移動手段の情報を管理

### マイグレーションファイル
- `supabase/migrations/20250227120000_create_initial_schema.sql`

## 🔐 認証フロー

1. ユーザーは Clerk の `<SignInButton>` または Google OAuth 経由でログインする。
2. ログイン後、ページアクセス時などに Next.js Server Actions 経由で `ensureSupabaseUser()` が呼び出される。
3. `ensureSupabaseUser()` は Service Role クライアントを使用し、Supabase の `public.users` テーブルに Clerk の `userId` と同期したユーザー情報を Upsert する。
4. クライアント側の CRUD 操作は、Clerk から発行された JWT トークン（`clerkMiddleware` 経由で設定されるもの）を用いて Supabase にリクエストを送り、RLS（Row Level Security）によって権限がチェックされる。

## 🔌 実装されたユーティリティ

- `lib/supabase/client.ts`: ブラウザ用 Supabase クライアント
- `lib/supabase/server.ts`: サーバー用 Supabase クライアント
- `lib/supabase/service-role.ts`: 同期処理用の権限昇格クライアント（サーバー専用）
- `lib/supabase/auth-helpers.ts`: Clerk ユーザーと Supabase を同期する `ensureSupabaseUser` 等
- `lib/clerk/utils.ts`: Clerk のユーザー情報取得ヘルパー

## 📝 次のステップ

1. [ ] 各ページの Server Components や Server Actions の冒頭で `ensureSupabaseUser()` を呼び出す実装の追加。
2. [ ] ユーザー向けの Clerk 環境変数（Keys）の取得と `.env.local` への設定。
3. [ ] ユーザー向けの Supabase 環境変数の設定と、SQLマイグレーションの実行。
4. [ ] フロントエンドの静的モックデータ（`lib/mock-data.ts`）を Supabase データベースからの動的フェッチ（Server Actions）に置き換える。

## 📖 参考リソース

- [Clerk Next.js Documentation](https://clerk.com/docs/quickstarts/nextjs)
- [Supabase SSR Documentation](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Clerk + Supabase Integration](https://clerk.com/docs/integrations/databases/supabase)