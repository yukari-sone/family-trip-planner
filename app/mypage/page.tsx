import Link from "next/link";
import Image from "next/image";
import { Plane, Star, Map, Edit, CheckCircle } from "lucide-react";
import { mockData } from "@/lib/mock-data";

export default function MyPage() {
  const myTrips = mockData.trips; // モックデータを「自分のプラン」として表示

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* ユーザープロフィール (パスポート風) */}
      <div className="bg-[#1A2B4C] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        {/* パスポートの透かし */}
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <Plane className="w-64 h-64 -rotate-45 transform translate-x-1/4 -translate-y-1/4" />
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30 backdrop-blur-sm">
            <span className="text-3xl">👨‍👩‍👧</span>
          </div>
          <div className="text-center md:text-left space-y-2">
            <div className="text-[#00A4E5] font-flight text-sm font-bold tracking-widest">PASSPORT</div>
            <h1 className="text-3xl font-bold">サトシ さん</h1>
            <p className="text-gray-300">家族構成: 8歳 男, 5歳 女</p>
          </div>
          
          <div className="md:ml-auto bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20 flex gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FFD166]">12</div>
              <div className="text-xs text-gray-300 font-bold mt-1">作成プラン</div>
            </div>
            <div className="w-px bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00A4E5]">5</div>
              <div className="text-xs text-gray-300 font-bold mt-1">スタンプ</div>
            </div>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="flex gap-4 border-b border-gray-200">
        <button className="pb-3 border-b-2 border-[#1A2B4C] font-bold text-[#1A2B4C] px-2">
          作成したプラン
        </button>
        <button className="pb-3 text-gray-500 hover:text-gray-800 font-bold px-2">
          お気に入り
        </button>
      </div>

      {/* プラン一覧 */}
      <div className="grid md:grid-cols-2 gap-6">
        {myTrips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex flex-col h-full">
            <div className="relative h-40 w-full bg-gray-100">
              <Image src={trip.imageUrl} alt={trip.title} fill className="object-cover" />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1A2B4C] flex items-center gap-1 shadow-sm">
                {trip.id === "1" ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Edit className="w-3 h-3 text-gray-500" />}
                {trip.id === "1" ? "旅行済・公開中" : "計画中・非公開"}
              </div>
            </div>
            
            <div className="p-5 flex-grow flex flex-col">
              <h2 className="font-bold text-lg leading-tight mb-2 line-clamp-2">{trip.title}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Map className="w-4 h-4" /> {trip.area}
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                <Link 
                  href={`/trips/${trip.id}/edit`}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-[#1A2B4C] font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                >
                  <Edit className="w-4 h-4" /> 編集
                </Link>
                {trip.id === "1" && (
                  <Link 
                    href={`/review/${trip.id}`}
                    className="flex-1 bg-[#00A4E5] hover:bg-blue-600 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-1 shadow-sm transition-colors"
                  >
                    <Star className="w-4 h-4" /> 振り返り
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* 新規作成カード */}
        <Link href="/trips/new" className="bg-white border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-8 text-gray-500 hover:text-[#00A4E5] hover:border-[#00A4E5] hover:bg-blue-50 transition-colors min-h-[250px] group">
          <div className="w-16 h-16 bg-gray-50 group-hover:bg-blue-100 rounded-full flex items-center justify-center mb-4 transition-colors">
            <Plane className="w-8 h-8 group-hover:scale-110 transition-transform" />
          </div>
          <span className="font-bold text-lg">新しいプランを作る</span>
        </Link>
      </div>
    </div>
  );
}
