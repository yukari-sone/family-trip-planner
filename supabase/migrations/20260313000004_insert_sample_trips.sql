-- ============================================
-- Seed Data: おすすめの旅行プラン（熱海・沖縄・台湾）
-- ※ 最初に表示するサンプルデータを作成します
-- ============================================

DO $$
DECLARE
  v_admin_id uuid;
  v_trip_atami_id uuid;
  v_trip_okinawa_id uuid;
  v_trip_taiwan_id uuid;
BEGIN
  -- 1. サンプル用の「公式アカウント」ユーザーを作成
  -- （すでに存在する場合はそのIDを取得、なければ作成）
  SELECT id INTO v_admin_id FROM public.users WHERE clerk_user_id = 'sample_admin_account_001';
  
  IF v_admin_id IS NULL THEN
    INSERT INTO public.users (clerk_user_id, email, display_name, avatar_url, family_info)
    VALUES (
      'sample_admin_account_001',
      'hello@familytrip.example.com',
      '公式トラベルガイド',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&q=80',
      '"小学生低学年, 幼児"'
    ) RETURNING id INTO v_admin_id;
  END IF;

  -- 2. プランの作成

  -- ✈️ プラン1: 熱海（1泊2日）
  INSERT INTO public.trips (user_id, title, area, target_ages, is_public, image_url)
  VALUES (
    v_admin_id,
    '【熱海1泊2日】温泉と海鮮！小学生も喜ぶリゾート特急の旅',
    '熱海・伊豆',
    '小学生低学年',
    true,
    'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?q=80&w=1000'
  ) RETURNING id INTO v_trip_atami_id;

  -- 熱海のスポット
  INSERT INTO public.trip_spots (trip_id, place_name, type, icon, start_time, day_part, order_index, positive_comment, failure_alert) VALUES
  (v_trip_atami_id, '東京駅（サフィール踊り子乗車）', 'transit', 'train', '10:00:00', 'morning', 0, '個室を予約したら子供が大はしゃぎ！周りを気にせず過ごせました。', '個室は1ヶ月前の10時ちょうどに予約しないとすぐ埋まります！'),
  (v_trip_atami_id, '熱海駅 到着・駅前商店街で食べ歩き', 'spot', 'navigation', '11:30:00', 'morning', 1, 'まる天の「たこ天」が絶品。子供も喜んで食べていました。', '休日は激混みでベビーカー移動はかなり厳しいです。抱っこ紐推奨。'),
  (v_trip_atami_id, '熱海サンビーチで砂遊び', 'spot', 'navigation', '14:00:00', 'afternoon', 2, '海に入らなくても砂遊びだけで2時間遊べました！手洗い場も近くにあります。', 'トンビが多いので、お菓子を外で食べる時は要注意！'),
  (v_trip_atami_id, 'ホテルチェックイン・温泉', 'spot', 'navigation', '16:00:00', 'afternoon', 3, 'キッズルーム付きのプランにして大正解。夕食まで退屈しませんでした。', null),
  (v_trip_atami_id, 'ロープウェイで秘宝館・絶景展望台へ', 'spot', 'navigation', '10:00:00', 'morning', 4, '頂上からの眺めが最高。アイスを食べながら休憩しました。', '風が強い日はロープウェイが揺れて子供が少し怖がりました。');


  -- ✈️ プラン2: 沖縄（2泊3日）
  INSERT INTO public.trips (user_id, title, area, target_ages, is_public, image_url)
  VALUES (
    v_admin_id,
    '【沖縄2泊3日】美ら海水族館とプール満喫！初めての飛行機旅',
    '沖縄本島',
    '幼児（3-5歳）',
    true,
    'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=1000'
  ) RETURNING id INTO v_trip_okinawa_id;

  -- 沖縄のスポット
  INSERT INTO public.trip_spots (trip_id, place_name, type, icon, start_time, day_part, order_index, positive_comment, failure_alert) VALUES
  (v_trip_okinawa_id, '羽田空港 出発', 'transit', 'plane', '08:30:00', 'morning', 0, '搭乗前にキッズスペースで体力を削っておいたので、機内ではぐっすり寝てくれました！', '保安検査場が長蛇の列で焦りました。早めに行動が吉。'),
  (v_trip_okinawa_id, '那覇空港 到着・レンタカー受け取り', 'transit', 'car', '11:30:00', 'morning', 1, null, '送迎バス待ちと手続きで1時間以上かかりました。子供のお菓子や飲み物は事前に持っておくべき。'),
  (v_trip_okinawa_id, '沖縄そばでランチ', 'spot', 'navigation', '13:00:00', 'afternoon', 2, '座敷席のあるお店を選んだので、子連れでもリラックスして食べられました。', null),
  (v_trip_okinawa_id, 'リゾートホテルでプール遊び', 'spot', 'navigation', '15:30:00', 'afternoon', 3, '屋内プール・屋外プール両方あって最高！子供用の浮き輪も無料で借りられました。', null),
  (v_trip_okinawa_id, '美ら海水族館', 'spot', 'navigation', '09:00:00', 'morning', 4, '朝イチで行ったらジンベエザメの水槽前で最前列で見られました！', '水族館の中は冷房がかなり効いているので、薄手の上着は必須です。');


  -- ✈️ プラン3: 台湾（3泊4日）
  INSERT INTO public.trips (user_id, title, area, target_ages, is_public, image_url)
  VALUES (
    v_admin_id,
    '【台湾3泊4日】週末弾丸！小籠包とランタン飛ばし家族旅行',
    '台湾・台北',
    '小学生高学年',
    true,
    'https://images.unsplash.com/photo-1558005530-fa2692a6c80c?q=80&auto=format&fit=crop&w=1000'
  ) RETURNING id INTO v_trip_taiwan_id;

  -- 台湾のスポット
  INSERT INTO public.trip_spots (trip_id, place_name, type, icon, start_time, day_part, order_index, positive_comment, failure_alert) VALUES
  (v_trip_taiwan_id, '成田空港 出発（LCC）', 'transit', 'plane', '09:00:00', 'morning', 0, 'LCCでしたが、事前にNetflixで映画をダウンロードしておいたので退屈しませんでした。', '機内食が出ないので、乗る前におにぎりを買って正解でした。'),
  (v_trip_taiwan_id, '鼎泰豊で小籠包ランチ', 'spot', 'navigation', '14:00:00', 'afternoon', 1, '本店ではなくデパートの中の店舗に行ったら、待ち時間も涼しくて快適でした！', '子供には少しスープが熱すぎたので、冷ます用のお皿をもらうと良いです。'),
  (v_trip_taiwan_id, '台北101の展望台', 'spot', 'navigation', '16:00:00', 'afternoon', 2, '夕暮れ時に登ると、明るい景色と夜景の両方が楽しめてお得感がありました。', null),
  (v_trip_taiwan_id, '士林夜市で食べ歩き', 'spot', 'navigation', '19:00:00', 'evening', 3, '巨大なフライドチキン（ジーパイ）は家族4人で分けてちょうど良いサイズでした。', '人が多すぎて迷子になりかけました。目立つ色の服を着せておくべき。'),
  (v_trip_taiwan_id, '十分でランタン飛ばし', 'spot', 'navigation', '11:00:00', 'morning', 4, 'ランタンに願い事を書く作業に子供が夢中でした！良い写真が撮れました。', '電車（平渓線）は1時間に1本しかないので、時刻表の確認は絶対必要です！');

END $$;
