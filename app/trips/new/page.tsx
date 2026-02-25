import Link from "next/link";
import { ArrowLeft, Save, MapPin } from "lucide-react";

export default function NewTripPage() {
  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-8 sticky top-20 z-40">
        <div className="flex items-center gap-4">
          <Link href="/mypage" className="text-gray-500 hover:text-[#1A2B4C] transition-colors p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-lg md:text-xl">新しいプランを作成</h1>
        </div>
        <button className="bg-[#1A2B4C] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-900 transition-colors shadow-sm">
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">下書き保存</span>
        </button>
      </div>

      <div className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#1A2B4C] mb-2">タイトル</label>
            <input 
              type="text" 
              placeholder="例: 北海道3泊4日 家族でリゾート満喫" 
              className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#00A4E5] focus:border-transparent text-lg font-bold"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#1A2B4C] mb-2">エリア</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="例: 北海道" 
                  className="w-full border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#00A4E5]"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-[#1A2B4C] mb-2">対象年齢（推奨）</label>
              <select className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#00A4E5] bg-white text-gray-700 appearance-none">
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
          <button className="bg-gray-100 hover:bg-gray-200 text-[#1A2B4C] px-6 py-3 rounded-xl font-bold transition-colors w-full md:w-auto">
            タイムラインの編集に進む
          </button>
        </div>
      </div>
    </div>
  );
}
