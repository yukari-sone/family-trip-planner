import Link from "next/link";
import { ArrowLeft, Save, MapPin } from "lucide-react";
import { ensureSupabaseUser } from "@/lib/supabase/auth-helpers";
import { createTripAction } from "@/app/actions/trip";

export default async function NewTripPage(props: { searchParams?: Promise<{ copyFrom?: string }> }) {
  await ensureSupabaseUser();
  const searchParams = await props.searchParams;
  const copyFromId = searchParams?.copyFrom;

  let initialData = null;
  if (copyFromId) {
    const { createServiceRoleClient } = await import("@/lib/supabase/service-role");
    const supabase = createServiceRoleClient();
    const { data: trip } = await supabase
      .from("trips")
      .select("*")
      .eq("id", copyFromId)
      .single();
    if (trip) {
      initialData = trip;
    }
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <form action={createTripAction}>
        {copyFromId && <input type="hidden" name="copyFromId" value={copyFromId} />}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-8 sticky top-20 z-40">
          <div className="flex items-center gap-4">
            <Link href="/mypage" className="text-gray-500 hover:text-[#1A2B4C] transition-colors p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-lg md:text-xl">
              {initialData ? "プランをコピーして作成" : "新しいプランを作成"}
            </h1>
          </div>
          <button 
            type="submit"
            className="bg-[#1A2B4C] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-900 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">保存して次へ</span>
          </button>
        </div>

        <div className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-[#1A2B4C] mb-2">タイトル <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                id="title"
                name="title"
                required
                defaultValue={initialData?.title ? `${initialData.title} (コピー)` : ""}
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
                    defaultValue={initialData?.area || ""}
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
                  defaultValue={initialData?.target_ages || ""}
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
          </div>

          <div className="pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 mb-4">基本情報を入力したら、スポットを追加してタイムラインを作りましょう。</p>
            <button 
              type="submit"
              className="bg-gray-100 hover:bg-gray-200 text-[#1A2B4C] px-6 py-3 rounded-xl font-bold transition-colors w-full md:w-auto"
            >
              タイムラインの編集に進む
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
