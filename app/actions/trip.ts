'use server';

import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { ensureSupabaseUser } from '@/lib/supabase/auth-helpers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createTripAction(formData: FormData) {
  // 1. 現在のユーザーを取得
  const user = await ensureSupabaseUser();
  
  if (!user) {
    throw new Error('User not found. Please log in.');
  }

  // 2. フォームデータの取得
  const title = formData.get('title') as string;
  const area = formData.get('area') as string;
  const targetAges = formData.get('targetAges') as string;
  const copyFromId = formData.get('copyFromId') as string;

  if (!title || !area) {
    throw new Error('Title and Area are required');
  }

  // 3. Supabaseにデータ挿入
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('trips')
    .insert([
      {
        user_id: user.id,
        title,
        area,
        target_ages: targetAges,
        is_public: false, // デフォルトは非公開
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating trip:', error);
    throw new Error('Failed to create trip');
  }

  // もしコピープランなら、スポットもコピーする
  if (copyFromId) {
    const { data: spots } = await supabase
      .from('trip_spots')
      .select('*')
      .eq('trip_id', copyFromId);

    if (spots && spots.length > 0) {
      const spotsToInsert = spots.map(spot => ({
        trip_id: data.id,
        place_name: spot.place_name || '名称未設定',
        type: spot.type || 'spot',
        icon: spot.icon || null,
        start_time: spot.start_time || null,
        day_part: spot.day_part || null,
        order_index: spot.order_index || 0,
        // コピー時は他人のレビュー（成功・失敗）は一旦リセットまたは残すか選択可能ですが、今回は残すことにします
        positive_comment: spot.positive_comment || null,
        failure_alert: spot.failure_alert || null,
      }));

      await supabase.from('trip_spots').insert(spotsToInsert);
    }
  }

  // 4. 作成したプランの詳細（編集）ページへリダイレクト
  redirect(`/trips/${data.id}/edit`);
}

export async function updateTripAction(formData: FormData) {
  const user = await ensureSupabaseUser();
  
  if (!user) {
    throw new Error('User not found. Please log in.');
  }

  const tripId = formData.get('tripId') as string;
  const title = formData.get('title') as string;
  const area = formData.get('area') as string;
  const targetAges = formData.get('targetAges') as string;
  const isPublic = formData.get('isPublic') === 'on';

  if (!tripId || !title || !area) {
    throw new Error('Trip ID, Title, and Area are required');
  }

  const supabase = createServiceRoleClient();
  
  // 画像のアップロード処理
  const imageFile = formData.get('imageFile') as File | null;
  let imageUrl = undefined;
  
  if (imageFile && imageFile.size > 0) {
    const buffer = await imageFile.arrayBuffer();
    const fileExtension = imageFile.name.split('.').pop();
    const filePath = `trips/${tripId}/${Date.now()}.${fileExtension}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('trip_images')
      .upload(filePath, buffer, {
        contentType: imageFile.type,
        upsert: true
      });
      
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
    } else {
      const { data } = supabase.storage.from('trip_images').getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }
  }

  const updateData: any = {
    title,
    area,
    target_ages: targetAges,
    is_public: isPublic,
  };
  
  if (imageUrl) {
    updateData.image_url = imageUrl;
  }

  const { error } = await supabase
    .from('trips')
    .update(updateData)
    .eq('id', tripId)
    .eq('user_id', user.id); // セキュリティのため、作成者本人のみ更新可能とする

  if (error) {
    console.error('Error updating trip:', error);
    throw new Error('Failed to update trip');
  }

  // 編集ページへリダイレクト（更新を反映するため）
  redirect(`/trips/${tripId}/edit`);
}

export async function deleteTripAction(tripId: string) {
  const user = await ensureSupabaseUser();
  
  if (!user) {
    throw new Error('User not found. Please log in.');
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', tripId)
    .eq('user_id', user.id); // セキュリティのため、作成者本人のみ削除可能とする

  if (error) {
    console.error('Error deleting trip:', error);
    throw new Error('Failed to delete trip');
  }

  revalidatePath('/mypage');
  revalidatePath('/trips');
}

