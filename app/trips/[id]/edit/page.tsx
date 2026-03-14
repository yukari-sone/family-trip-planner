import Link from "next/link";
import { ArrowLeft, Save, MapPin } from "lucide-react";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { ensureSupabaseUser } from "@/lib/supabase/auth-helpers";
import { redirect } from "next/navigation";
import { updateTripAction } from "@/app/actions/trip";
import { EditTripClient } from "./EditTripClient";

export default async function EditTripPage(props: { params: Promise<{ id: string }> }) {
  // 非同期のparamsを解決
  const params = await props.params;
  const { id } = params;
  
  const user = await ensureSupabaseUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Supabaseからプランの基本情報を取得
  const supabase = createServiceRoleClient();
  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", id)
    .single();

  if (!trip) {
    return <div className="text-center py-20 text-gray-500">旅行プランが見つかりません。</div>;
  }

  // 作成者本人しか編集できないようにする
  if (trip.user_id !== user.id) {
    return <div className="text-center py-20 text-red-500">このプランを編集する権限がありません。</div>;
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <form action={updateTripAction}>
        <input type="hidden" name="tripId" value={trip.id} />
        
        {/* ヘッダー */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-8 sticky top-20 z-40">
          <div className="flex items-center gap-4">
            <Link href="/mypage" className="text-gray-500 hover:text-[#1A2B4C] transition-colors p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-lg md:text-xl line-clamp-1">基本情報を編集</h1>
          </div>
          <button 
            type="submit"
            className="bg-[#1A2B4C] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-900 transition-colors shrink-0 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">更新を保存</span>
          </button>
        </div>

        {/* 基本情報編集フォーム */}
        <div className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="imageFile" className="block text-sm font-bold text-[#1A2B4C] mb-2">カバー画像 (任意)</label>
              {trip.image_url && (
                <div className="mb-3 w-full h-40 relative rounded-xl overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={trip.image_url} alt="Cover" className="object-cover w-full h-full" />
                </div>
              )}
              <input 
                type="file" 
                id="imageFile"
                name="imageFile"
                accept="image/*"
                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#00A4E5] text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">※新しい画像を選択すると上書きされます。</p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <label htmlFor="title" className="block text-sm font-bold text-[#1A2B4C] mb-2">タイトル <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                id="title"
                name="title"
                required
                defaultValue={trip.title}
                placeholder="例: 北海道3泊4日 家族でリゾート満喫" 
                className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#00A4E5] focus:border-transparent text-lg font-bold"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="area" className="block text-sm font-bold text-[#1A2B4C] mb-2">エリア <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    id="area"
                    name="area"
                    required
                    defaultValue={trip.area}
                    placeholder="例: 北海道" 
                    className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#00A4E5]"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="targetAges" className="block text-sm font-bold text-[#1A2B4C] mb-2">対象年齢（推奨）</label>
                <select 
                  id="targetAges"
                  name="targetAges"
                  defaultValue={trip.target_ages || ""}
                  className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#00A4E5] bg-white text-gray-700 appearance-none"
                >
                  <option value="">選択してください</option>
                  <option value="乳児">乳児（0-2歳）</option>
                  <option value="幼児">幼児（3-5歳）</option>
                  <option value="小学生低学年">小学生低学年（6-8歳）</option>
                  <option value="小学生高学年">小学生高学年（9-12歳）</option>
                  <option value="中学生以上">中学生以上</option>
                  <option value="幅広い年齢">幅広い年齢</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <input 
                type="checkbox" 
                id="isPublic" 
                name="isPublic"
                defaultChecked={trip.is_public}
                className="w-5 h-5 text-[#00A4E5] rounded border-gray-300 focus:ring-[#00A4E5]"
              />
              <label htmlFor="isPublic" className="text-sm font-bold text-gray-700">
                このプランを公開する（他のユーザーも見られるようになります）
              </label>
            </div>
          </div>
        </div>
      </form>

      {/* タイムライン（スポット）編集エリア */}
      <h2 className="font-bold text-xl text-[#1A2B4C] mb-4">タイムライン</h2>
      <EditTripClient tripId={trip.id} />
    </div>
  );
}