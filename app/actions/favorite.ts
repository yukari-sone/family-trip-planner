'use server';

import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { ensureSupabaseUser } from '@/lib/supabase/auth-helpers';
import { revalidatePath } from 'next/cache';

// お気に入り状態の切り替え
export async function toggleFavoriteAction(tripId: string) {
  const user = await ensureSupabaseUser();
  if (!user) {
    throw new Error('User not logged in');
  }

  const supabase = createServiceRoleClient();

  // 現在のお気に入り状態を確認
  const { data: existingFavorite } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('trip_id', tripId)
    .maybeSingle();

  if (existingFavorite) {
    // 既にお気に入りされていれば削除（解除）
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', existingFavorite.id);

    if (error) throw new Error('Failed to remove favorite');
    
    // パスを再検証
    revalidatePath(`/trips/${tripId}`);
    revalidatePath('/mypage');
    return { isFavorite: false };
  } else {
    // お気に入りされていなければ追加
    const { error } = await supabase
      .from('favorites')
      .insert([
        { user_id: user.id, trip_id: tripId }
      ]);

    if (error) throw new Error('Failed to add favorite');
    
    // パスを再検証
    revalidatePath(`/trips/${tripId}`);
    revalidatePath('/mypage');
    return { isFavorite: true };
  }
}
