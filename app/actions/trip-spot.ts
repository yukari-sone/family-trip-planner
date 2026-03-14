'use server';

import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { ensureSupabaseUser } from '@/lib/supabase/auth-helpers';
import { revalidatePath } from 'next/cache';

// スポット一覧を取得する
export async function getTripSpotsAction(tripId: string) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('trip_spots')
    .select('*')
    .eq('trip_id', tripId)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching trip spots:', error);
    return [];
  }

  return data || [];
}

// 新しいスポットを追加する
export async function addTripSpotAction(tripId: string, currentSpotsCount: number) {
  const user = await ensureSupabaseUser();
  if (!user) throw new Error('Unauthorized');

  const supabase = createServiceRoleClient();
  
  // 新しいスポットのデータ（初期値）
  const newSpot = {
    trip_id: tripId,
    place_name: '新しいスポット',
    type: 'spot',
    order_index: currentSpotsCount, // 一番最後に追加
  };

  const { data, error } = await supabase
    .from('trip_spots')
    .insert([newSpot])
    .select()
    .single();

  if (error) {
    console.error('Error adding trip spot:', error);
    throw new Error('Failed to add trip spot');
  }

  // ページを再検証して最新データを反映
  revalidatePath(`/trips/${tripId}/edit`);
  return data;
}

// スポットを削除する
export async function deleteTripSpotAction(spotId: string, tripId: string) {
  const user = await ensureSupabaseUser();
  if (!user) throw new Error('Unauthorized');

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('trip_spots')
    .delete()
    .eq('id', spotId)

  if (error) {
    console.error('Error deleting trip spot:', error);
    throw new Error('Failed to delete trip spot');
  }

  revalidatePath(`/trips/${tripId}/edit`);
}

// スポットの順序を一括更新する（ドラッグ＆ドロップ後）
export async function updateSpotOrderAction(tripId: string, orderedSpotIds: string[]) {
  const user = await ensureSupabaseUser();
  if (!user) throw new Error('Unauthorized');

  const supabase = createServiceRoleClient();
  
  // 各スポットの order_index を更新
  const promises = orderedSpotIds.map((id, index) => 
    supabase
      .from('trip_spots')
      .update({ order_index: index })
      .eq('id', id)
  );

  await Promise.all(promises);

  revalidatePath(`/trips/${tripId}/edit`);
}

// スポットの情報を更新する
export async function updateTripSpotAction(spotId: string, tripId: string, updates: any) {
  const user = await ensureSupabaseUser();
  if (!user) throw new Error('Unauthorized');

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('trip_spots')
    .update(updates)
    .eq('id', spotId)
    .select()
    .single();

  if (error) {
    console.error('Error updating trip spot:', error);
    throw new Error('Failed to update trip spot');
  }

  revalidatePath(`/trips/${tripId}/edit`);
  return data;
}

