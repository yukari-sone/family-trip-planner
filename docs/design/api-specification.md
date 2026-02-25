# API仕様書

## 1. 目的
本ドキュメントは、FamilyTrip Planner（仮）において、フロントエンド（ブラウザ）とバックエンド（Next.js Route Handlers）間で通信を行うためのAPIインターフェース仕様を定義する。

※注: 基本的なデータのCRUD（作成・読み取り・更新・削除）については、クライアントからSupabaseのSDK（REST API）を直接呼び出す（RLSで保護）アーキテクチャを採用するため、本ドキュメントでは「複雑なサーバーサイド処理」を必要とする独自のエンドポイントのみを定義する。

## 2. 設計原則
- HTTPメソッド（GET, POST）を適切に使用する。
- データ形式はJSONを基本とする（KMLなどのファイルダウンロードを除く）。
- ステータスコード（200, 202, 400, 401, 404, 500）を用いて処理結果を明確に示す。

## 3. 認証・認可
- 本API群を呼び出す際、クライアントはSupabase Authで取得したセッション情報（クッキーまたはAuthorizationヘッダのBearer JWT）を送信する。
- サーバー側（Next.js）は `@supabase/ssr` 等を利用してセッションを検証し、対象リソースの操作権限（本人確認）を行う。

---

## 4. エンドポイント一覧

### 4.1 ムービー生成トリガー API

- **概要**: 旅程の振り返り入力が完了した際、非同期の動画生成処理（ワーカー）をキックする。
- **エンドポイント**: `POST /api/trips/{tripId}/generate-movie`
- **認証**: 必須（旅程の作成者本人のみ実行可能）

**リクエスト (JSON)**
```json
{
  "bgmType": "pop",
  "style": "passport-theme"
}
```
*(※ `tripId` はパスパラメータから取得)*

**レスポンス - 成功時 (202 Accepted)**
非同期処理のため、受付完了のステータスとJob IDを返す。
```json
{
  "status": "processing",
  "jobId": "job-12345678-abcd",
  "message": "動画の生成を開始しました。数分後に完了します。"
}
```

**レスポンス - エラー時 (400 Bad Request)**
必須の写真データが存在しない場合など。
```json
{
  "error": "Validation Error",
  "message": "ムービー生成に必要な画像がスポットに登録されていません。"
}
```

---

### 4.2 KMLエクスポート API

- **概要**: 対象の旅程データを読み込み、Googleマイマップ等にインポート可能なKML形式のXMLファイルを動的生成して返す。
- **エンドポイント**: `GET /api/trips/{tripId}/export-kml`
- **認証**: 
  - 自分の非公開プランを出力する場合は必須。
  - 公開プラン（`is_public = true`）を出力する場合は認証不要。

**リクエスト**
パラメータなし（パスパラメータから `tripId` を取得）。

**レスポンス - 成功時 (200 OK)**
- **Headers**:
  - `Content-Type`: `application/vnd.google-earth.kml+xml`
  - `Content-Disposition`: `attachment; filename="trip-plan.kml"`
- **Body**: KMLフォーマットのXMLデータ
```xml
<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>箱根1泊2日満喫コース</name>
    <Placemark>
      <name>箱根彫刻の森美術館</name>
      <description>広い芝生で走り回れる！【注意】お昼時はレストラン激混み</description>
      <Point>
        <coordinates>139.0514,35.2442,0</coordinates>
      </Point>
    </Placemark>
    <!-- 他のスポットデータ -->
  </Document>
</kml>
```

**レスポンス - エラー時 (404 Not Found)**
旅程が存在しない、またはアクセス権がない場合。
```json
{
  "error": "Not Found",
  "message": "指定されたプランが見つからないか、アクセス権がありません。"
}
```

---

### 4.3 旅のしおりPDF出力 API (Phase 1 MVP対象)

- **概要**: 旅程データを元に、子供が喜ぶデザイン（スタンプラリー風など）の「旅のしおり」PDFを動的生成して返す。
- **エンドポイント**: `GET /api/trips/{tripId}/export-pdf`
- **認証**: 必須または公開設定に準拠

**リクエスト**
パラメータなし（パスパラメータから `tripId` を取得）。

**レスポンス - 成功時 (200 OK)**
- **Headers**:
  - `Content-Type`: `application/pdf`
  - `Content-Disposition`: `attachment; filename="travel-guide.pdf"`
- **Body**: PDFバイナリデータ
