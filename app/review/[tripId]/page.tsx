import Link from "next/link";
import { Camera, AlertTriangle, Smile, Video, Check, Train, Plane, Car, Navigation, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ensureSupabaseUser } from "@/lib/supabase/auth-helpers";
import { redirect } from "next/navigation";
import { updateReviewAction } from "@/app/actions/review";

export default async function ReviewPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  
  const user = await ensureSupabaseUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Supabaseからプランとスポットの情報を取得
  const supabase = await createClient();
  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .single();

  if (!trip || trip.user_id !== user.id) {
    return <div className="text-center py-20 text-red-500 font-bold">このプランの振り返りを行う権限がありません。</div>;
  }

  const { data: spots } = await supabase
    .from("trip_spots")
    .select("*")
    .eq("trip_id", tripId)
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

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1A2B4C]">旅行の振り返り</h1>
        <p className="text-gray-600">思い出の写真と一言感想を残して、他のパパママにシェアしよう！</p>
      </div>

      <form action={updateReviewAction}>
        <input type="hidden" name="tripId" value={trip.id} />
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-[#1A2B4C] p-4 text-white font-bold flex justify-between items-center">
            <span>{trip.title} の記録</span>
            <button 
              type="submit"
              className="bg-white text-[#1A2B4C] px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-100 transition-colors"
            >
              <Save className="w-4 h-4" /> 保存
            </button>
          </div>

          <div className="p-4 md:p-6 space-y-10">
            {tripSpots.length === 0 ? (
              <p className="text-center text-gray-500 py-4">まだスポットがありません</p>
            ) : (
              tripSpots.map((spot, index) => {
                const isTransit = spot.type === "transit";
                return (
                  <div key={spot.id} className="relative pb-10 border-b border-gray-100 last:border-0 last:pb-0">
                    <input type="hidden" name={`spot_id_${index}`} value={spot.id} />
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-flight text-sm shrink-0 ${isTransit ? 'bg-gray-200 text-gray-600' : 'bg-[#00A4E5] text-white'}`}>
                        {isTransit ? getTransitIcon(spot.icon || "navigation") : index + 1}
                      </div>
                      <h3 className={`font-bold text-lg ${isTransit ? 'text-gray-700' : 'text-[#1A2B4C]'}`}>
                        {spot.place_name}
                      </h3>
                    </div>

                    <div className="pl-11 space-y-4">
                      {/* 成功コメント */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-[#1A2B4C]">
                          <Smile className="w-4 h-4 text-[#00A4E5]" /> {isTransit ? '移動の工夫・良かったこと' : '楽しかったこと・おすすめ'}
                        </label>
                        <textarea 
                          name={`positive_${spot.id}`}
                          className="w-full bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A4E5] focus:bg-white transition-all resize-none h-20"
                          placeholder={isTransit ? "例: 一番後ろの席を取ったら気兼ねなく倒せて正解でした" : "例: 子供が遊具で大はしゃぎでした！"}
                          defaultValue={spot.positive_comment || ""}
                        ></textarea>
                      </div>

                      {/* 失敗アラート */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-[#1A2B4C]">
                          <AlertTriangle className="w-4 h-4 text-amber-500" /> 注意点・失敗談（To-Don't）
                        </label>
                        <input 
                          type="text"
                          name={`failure_${spot.id}`}
                          className="w-full bg-amber-50/30 border border-amber-100 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                          placeholder="例: ベビーカーは畳む必要あり / トイレが遠い"
                          defaultValue={spot.failure_alert || ""}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center space-y-4">
          <Video className="w-8 h-8 text-[#00A4E5] mx-auto" />
          <div>
            <h3 className="font-bold text-[#1A2B4C] mb-1">ムービー機能について</h3>
            <p className="text-sm text-gray-600">
              ※写真アップロードとムービー生成機能は今後のアップデートで追加予定です。<br/>
              今はテキストでの振り返りを保存してシェアできます！
            </p>
          </div>
          <button 
            type="submit"
            className="w-full md:w-auto bg-[#00A4E5] text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-md text-lg flex items-center justify-center gap-2 mx-auto"
          >
            <Save className="w-5 h-5" /> 振り返りを保存する
          </button>
        </div>
      </form>
    </div>
  );
}
