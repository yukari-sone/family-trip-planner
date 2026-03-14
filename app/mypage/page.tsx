import Link from "next/link";
import { Plane, Star, Map, Edit, CheckCircle } from "lucide-react";
import { ensureSupabaseUser } from "@/lib/supabase/auth-helpers";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export default async function MyPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await ensureSupabaseUser();
  const params = await searchParams;
  const currentTab = params.tab || 'my_trips';
  
  // Supabaseから実際の旅行プランを取得
  const supabase = createServiceRoleClient();
  let displayTrips = [];
  
  if (user) {
    if (currentTab === 'favorites') {
      // お気に入りのプランを取得
      const { data } = await supabase
        .from("favorites")
        .select(`
          trip_id,
          trips (
            id,
            title,
            area,
            is_public,
            image_url
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      if (data) {
        displayTrips = data.map(f => f.trips).filter(Boolean);
      }
    } else {
      // 自分の作成したプランを取得
      const { data } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      if (data) {
        displayTrips = data;
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* ユーザープロフィール (パスポート風) */}
      <div className="bg-[#1A2B4C] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        {/* パスポートの透かし */}
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <Plane className="w-64 h-64 -rotate-45 transform translate-x-1/4 -translate-y-1/4" />
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30 backdrop-blur-sm overflow-hidden">
            {user?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar_url} alt="Profile" className="object-cover w-full h-full" />
            ) : (
              <span className="text-3xl">👨‍👩‍👧</span>
            )}
          </div>
          <div className="text-center md:text-left space-y-2">
            <div className="text-[#00A4E5] font-flight text-sm font-bold tracking-widest">PASSPORT</div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h1 className="text-3xl font-bold">{user?.display_name || "ゲスト"} さん</h1>
              <Link href="/mypage/profile" className="bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-full backdrop-blur-sm">
                <Edit className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-gray-300">
              {user?.family_info ? (
                `家族構成: ${typeof user.family_info === 'string' ? user.family_info : JSON.stringify(user.family_info)}`
              ) : (
                "家族構成: 未設定"
              )}
            </p>
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
        <Link 
          href="/mypage?tab=my_trips"
          className={`pb-3 font-bold px-2 ${currentTab === 'my_trips' ? 'border-b-2 border-[#1A2B4C] text-[#1A2B4C]' : 'text-gray-500 hover:text-gray-800'}`}
        >
          作成したプラン
        </Link>
        <Link 
          href="/mypage?tab=favorites"
          className={`pb-3 font-bold px-2 flex items-center gap-1 ${currentTab === 'favorites' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-500 hover:text-gray-800'}`}
        >
          お気に入り <Star className="w-4 h-4" />
        </Link>
      </div>

      {/* プラン一覧 */}
      <div className="grid md:grid-cols-2 gap-6">
        {displayTrips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex flex-col h-full">
            <div className="relative h-40 w-full bg-gray-100 flex items-center justify-center">
              {trip.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={trip.image_url} alt={trip.title} className="object-cover w-full h-full" />
              ) : (
                <Plane className="w-12 h-12 text-gray-300" />
              )}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1A2B4C] flex items-center gap-1 shadow-sm">
                {trip.is_public ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Edit className="w-3 h-3 text-gray-500" />}
                {trip.is_public ? "旅行済・公開中" : "計画中・非公開"}
              </div>
            </div>
            
            <div className="p-5 flex-grow flex flex-col">
              <h2 className="font-bold text-lg leading-tight mb-2 line-clamp-2">{trip.title}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Map className="w-4 h-4" /> {trip.area}
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                {currentTab === 'favorites' ? (
                  <Link 
                    href={`/trips/${trip.id}`}
                    className="flex-1 bg-[#00A4E5] hover:bg-blue-600 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                  >
                    詳細を見る
                  </Link>
                ) : (
                  <>
                    <Link 
                      href={`/trips/${trip.id}/edit`}
                      className="flex-1 bg-gray-50 hover:bg-gray-100 text-[#1A2B4C] font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
                    >
                      <Edit className="w-4 h-4" /> 編集
                    </Link>
                    {trip.is_public && (
                      <Link 
                        href={`/review/${trip.id}`}
                        className="flex-1 bg-[#00A4E5] hover:bg-blue-600 text-white font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-1 shadow-sm transition-colors"
                      >
                        <Star className="w-4 h-4" /> 振り返り
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* 新規作成カード (自分のプランタブの時だけ表示) */}
        {currentTab === 'my_trips' && (
          <Link href="/trips/new" className="bg-white border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-8 text-gray-500 hover:text-[#00A4E5] hover:border-[#00A4E5] hover:bg-blue-50 transition-colors min-h-[250px] group">
            <div className="w-16 h-16 bg-gray-50 group-hover:bg-blue-100 rounded-full flex items-center justify-center mb-4 transition-colors">
              <Plane className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-bold text-lg">新しいプランを作る</span>
          </Link>
        )}
        
        {/* お気に入りがない時のメッセージ */}
        {currentTab === 'favorites' && displayTrips.length === 0 && (
          <div className="col-span-2 text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-bold mb-4">お気に入りのプランがまだありません。</p>
            <Link href="/trips" className="inline-block bg-[#00A4E5] text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-600 transition-colors">
              みんなのプランを探す
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
