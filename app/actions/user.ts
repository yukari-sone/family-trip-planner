'use server';

import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { ensureSupabaseUser } from '@/lib/supabase/auth-helpers';
import { redirect } from 'next/navigation';

export async function updateUserProfileAction(formData: FormData) {
  // 1. 現在のユーザーを取得
  const user = await ensureSupabaseUser();
  
  if (!user) {
    throw new Error('User not found. Please log in.');
  }

  // 2. フォームデータの取得
  const displayName = formData.get('displayName') as string;
  const familyInfo = formData.get('familyInfo') as string;

  if (!displayName) {
    throw new Error('Display Name is required');
  }

  // 3. Supabaseのユーザー情報を更新
  // family_infoはjsonb型なので、単なる文字列でもJSONとして有効な形(ダブルクォートで囲む等)にするか、オブジェクトにする必要がある。
  // ここでは文字列をそのままJSONに変換して保存する
  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from('users')
    .update({
      display_name: displayName,
      family_info: JSON.stringify(familyInfo),
    })
    .eq('id', user.id);

  if (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update profile');
  }

  // 4. マイページへリダイレクト
  redirect('/mypage');
}
