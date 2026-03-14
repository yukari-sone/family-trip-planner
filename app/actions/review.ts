'use server';

import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { ensureSupabaseUser } from '@/lib/supabase/auth-helpers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateReviewAction(formData: FormData) {
  const user = await ensureSupabaseUser();
  if (!user) throw new Error('Unauthorized');

  const tripId = formData.get('tripId') as string;
  if (!tripId) throw new Error('Trip ID is required');

  const supabase = createServiceRoleClient();
  
  // セキュリティチェック：ユーザーがこのプランの作成者か確認
  const { data: trip } = await supabase
    .from('trips')
    .select('user_id')
    .eq('id', tripId)
    .single();
    
  if (!trip || trip.user_id !== user.id) {
    throw new Error('Unauthorized to edit this trip');
  }

  // フォームデータからすべてのスポットの更新データを抽出
  const promises = [];
  
  // フォームキーを反復処理して、spot_id_X のようなキーを探す
  const entries = Array.from(formData.entries());
  for (const [key, value] of entries) {
    if (key.startsWith('spot_id_')) {
      const spotId = value as string;
      
      const positiveComment = formData.get(`positive_${spotId}`) as string || null;
      const failureAlert = formData.get(`failure_${spotId}`) as string || null;
      
      // 更新用のPromiseを追加
      promises.push(
        supabase
          .from('trip_spots')
          .update({
            positive_comment: positiveComment,
            failure_alert: failureAlert
          })
          .eq('id', spotId)
      );
    }
  }

  // すべての更新を並列実行
  if (promises.length > 0) {
    const results = await Promise.all(promises);
    
    // エラーチェック
    const errors = results.filter(r => r.error).map(r => r.error);
    if (errors.length > 0) {
      console.error('Errors updating review comments:', errors);
      throw new Error('Failed to update some review comments');
    }
  }

  // 更新後、該当ページとマイページを再検証
  revalidatePath(`/review/${tripId}`);
  revalidatePath(`/trips/${tripId}`);
  
  // 保存完了後、マイページに戻る（またはそのまま詳細ページへ）
  redirect(`/trips/${tripId}`);
}
