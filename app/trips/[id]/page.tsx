import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ensureSupabaseUser } from "@/lib/supabase/auth-helpers";
import { MapPin, Users, Download, FileText, Plus, AlertTriangle, ThumbsUp, Train, Plane, Car, Navigation, Sun, Sunrise, Moon } from "lucide-react";
import { FavoriteButton } from "@/components/ui/FavoriteButton";

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // ユーザー情報を取得（未ログインでも閲覧は可能とする場合があるためエラーにはしない）
  const user = await ensureSupabaseUser();

  // Supabaseからプランの情報を取得
  const supabase = await createClient();
  
  // プラン基本情報と作成者の情報を結合して取得
  const { data: trip } = await supabase
    .from("trips")
    .select(`
      *,
      users:user_id (
        display_name,
        family_info
      )
    `)
    .eq("id", id)
    .single();

  if (!trip) {
    return <div className="text-center py-20 text-gray-500 font-bold">旅行プランが見つかりません。</div>;
  }

  // 非公開プランの場合は作成者本人のみ閲覧可能
  if (!trip.is_public && (!user || user.id !== trip.user_id)) {
    return <div className="text-center py-20 text-red-500 font-bold">このプランは非公開です。</div>;
  }

  // お気に入り状態の取得
  let isFavorite = false;
  if (user) {
    const { data: favData } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("trip_id", id)
      .single();
    if (favData) isFavorite = true;
  }

  // スポット情報を取得
  const { data: spots } = await supabase
    .from("trip_spots")
    .select("*")
    .eq("trip_id", id)
    .order("order_index", { ascending: true });

  const tripSpots = spots || [];

  const getTransitIcon = (iconStr: string) => {
    switch (iconStr) {
      case "train": return <Train className="w-5 h-5 text-gray-500" />;
      case "plane": return <Plane className="w-5 h-5 text-gray-500" />;
      case "car": return <Car className="w-5 h-5 text-gray-500" />;
      default: return <Navigation className="w-5 h-5 text-gray-500" />;
    }
  };

  const getDayPartIcon = (dayPart: string) => {
    switch (dayPart) {
      case "morning": return <Sunrise className="w-4 h-4 text-orange-400" />;
      case "afternoon": return <Sun className="w-4 h-4 text-yellow-500" />;
      case "evening": return <Moon className="w-4 h-4 text-indigo-400" />;
      default: return null;
    }
  };

  const getDayPartLabel = (dayPart: string) => {
    switch (dayPart) {
      case "morning": return "朝";
      case "afternoon": return "昼";
      case "evening": return "夜";
      default: return "";
    }
  };

  const isOwner = user?.id === trip.user_id;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* ヘッダー画像 */}
      <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-lg bg-gray-200 flex items-center justify-center group">
        {trip.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={trip.image_url} alt={trip.title} className="object-cover w-full h-full" />
        ) : (
          <Plane className="w-20 h-20 text-gray-400" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        
        {/* お気に入りボタン（右上） */}
        {user && (
          <div className="absolute top-4 right-4">
            <FavoriteButton tripId={trip.id} initialIsFavorite={isFavorite} size="lg" />
          </div>
        )}

        <div className="absolute bottom-6 left-6 text-white space-y-2 pr-6">
          <div className="flex gap-2 mb-2">
            {!trip.is_public && (
              <span className="bg-gray-800/80 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded border border-gray-600">非公開</span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">{trip.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm font-medium pt-2">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4 text-gray-300"/> 
              作成者: {trip.users?.display_name || "ゲスト"}
            </span>
            {trip.target_ages && (
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-gray-300"/> 
                対象: {trip.target_ages}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-300"/> 
              {trip.area}
            </span>
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex flex-wrap gap-3">
        {isOwner && (
          <Link href={`/trips/${trip.id}/edit`} className="flex-1 bg-white border-2 border-gray-200 text-[#1A2B4C] px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 shadow-sm transition-colors">
            編集する
          </Link>
        )}
        <Link href={`/trips/${trip.id}/shiori`} className="flex-1 bg-white border border-gray-200 text-[#1A2B4C] px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 shadow-sm transition-colors">
          <FileText className="w-5 h-5" /> しおり出力
        </Link>
        <Link href={`/trips/new?copyFrom=${trip.id}`} className="flex-[2] bg-[#00A4E5] text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 shadow-sm transition-colors">
          <Plus className="w-5 h-5" /> このプランをCOPY
        </Link>
      </div>

      {/* タイムライン */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-8">
        <h2 className="text-xl font-bold border-b pb-4 mb-6">タイムライン</h2>
        
        {tripSpots.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            まだスポットが登録されていません。
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            
            {tripSpots.map((spot, index) => {
              const isTransit = spot.type === "transit";
              const displayTime = spot.start_time ? spot.start_time.substring(0, 5) : "";
              
              return (
                <div key={spot.id} className="relative flex items-start md:justify-center">
                  {/* 時間ラベル (PC用) */}
                  <div className="hidden md:flex w-24 justify-end pr-8 pt-1.5 flex-col items-end gap-1">
                    {displayTime && (
                      <span className={`font-flight text-sm font-bold ${isTransit ? 'text-gray-400' : 'text-[#00A4E5]'}`}>
                        {displayTime}
                      </span>
                    )}
                    {!displayTime && spot.day_part && (
                      <span className="flex items-center gap-1 text-sm font-bold text-gray-500">
                        {getDayPartIcon(spot.day_part)} {getDayPartLabel(spot.day_part)}
                      </span>
                    )}
                  </div>
                  
                  {/* タイムラインピン */}
                  <div className={`absolute left-0 md:relative md:left-auto flex items-center justify-center rounded-full z-10 shadow-sm mt-1
                    ${isTransit ? 'w-8 h-8 md:ml-1 bg-gray-100 border-2 border-gray-300 translate-x-1 md:translate-x-0' : 'w-10 h-10 bg-white border-4 border-[#00A4E5]'}`}
                  >
                    {isTransit ? getTransitIcon(spot.icon || "navigation") : <MapPin className="w-4 h-4 text-[#00A4E5]" />}
                  </div>

                  {/* コンテンツ */}
                  <div className="w-full pl-14 md:pl-8 md:w-[calc(50%-2.5rem)] md:pb-8">
                    <div className={`rounded-xl p-5 shadow-sm border ${isTransit ? 'bg-gray-50/50 border-dashed border-gray-200' : 'bg-gray-50 border-gray-100'}`}>
                      
                      {/* 時間ラベル (スマホ用) */}
                      <div className="md:hidden flex items-center gap-2 mb-2">
                        {displayTime && (
                          <span className={`font-flight text-xs font-bold ${isTransit ? 'text-gray-500' : 'text-[#00A4E5]'}`}>
                            {displayTime}
                          </span>
                        )}
                        {!displayTime && spot.day_part && (
                          <span className="flex items-center gap-1 text-xs font-bold text-gray-500">
                            {getDayPartIcon(spot.day_part)} {getDayPartLabel(spot.day_part)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        {isTransit && getTransitIcon(spot.icon || "navigation")}
                        <h3 className={`font-bold ${isTransit ? 'text-base text-gray-700' : 'text-lg text-[#1A2B4C]'}`}>
                          {spot.place_name}
                        </h3>
                      </div>
                      
                      {(spot.positive_comment || spot.failure_alert) && (
                        <div className="space-y-2 mt-3">
                          {spot.positive_comment && (
                            <div className="flex items-start gap-2 text-sm text-blue-900 bg-blue-50/80 p-3 rounded-lg border border-blue-100">
                              <ThumbsUp className="w-4 h-4 text-[#00A4E5] shrink-0 mt-0.5" />
                              <p className="font-medium leading-relaxed">{spot.positive_comment}</p>
                            </div>
                          )}

                          {spot.failure_alert && (
                            <div className="flex items-start gap-2 text-sm text-amber-900 bg-[#FFD166]/10 p-3 rounded-lg border border-[#FFD166]/30">
                              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              <p className="font-medium leading-relaxed">{spot.failure_alert}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
}
