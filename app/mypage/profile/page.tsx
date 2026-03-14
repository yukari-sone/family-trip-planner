import Link from "next/link";
import { ArrowLeft, Save, User } from "lucide-react";
import { ensureSupabaseUser } from "@/lib/supabase/auth-helpers";
import { updateUserProfileAction } from "@/app/actions/user";

export default async function ProfileEditPage() {
  const user = await ensureSupabaseUser();

  if (!user) {
    return <div>ログインが必要です。</div>;
  }

  // JSONBの可能性があるため、文字列ならそのまま、オブジェクトなら文字列化して初期値にする
  const initialFamilyInfo = user.family_info 
    ? (typeof user.family_info === 'string' ? user.family_info : JSON.stringify(user.family_info))
    : '';

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <form action={updateUserProfileAction}>
        <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-8 sticky top-20 z-40">
          <div className="flex items-center gap-4">
            <Link href="/mypage" className="text-gray-500 hover:text-[#1A2B4C] transition-colors p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-lg md:text-xl">プロフィールを編集</h1>
          </div>
          <button 
            type="submit"
            className="bg-[#1A2B4C] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-900 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">保存する</span>
          </button>
        </div>

        <div className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden mb-4">
              {user.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar_url} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <User className="w-10 h-10 text-gray-400" />
              )}
            </div>
            <p className="text-sm text-gray-500">※アイコン画像はGoogle/Clerkのアカウント画像が連携されます</p>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="displayName" className="block text-sm font-bold text-[#1A2B4C] mb-2">表示名（ニックネーム） <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                id="displayName"
                name="displayName"
                required
                defaultValue={user.display_name}
                placeholder="例: サトシ" 
                className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#00A4E5] focus:border-transparent font-medium"
              />
            </div>
            
            <div>
              <label htmlFor="familyInfo" className="block text-sm font-bold text-[#1A2B4C] mb-2">家族構成のメモ</label>
              <textarea 
                id="familyInfo"
                name="familyInfo"
                defaultValue={initialFamilyInfo}
                placeholder="例: 8歳 男, 5歳 女" 
                rows={3}
                className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#00A4E5] font-medium"
              />
              <p className="text-xs text-gray-500 mt-2">旅行プランの推奨年齢を考えるときの参考として表示されます。</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}