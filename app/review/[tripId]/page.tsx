import Link from "next/link";
import { mockData } from "@/lib/mock-data";
import { Camera, AlertTriangle, Smile, Video, Check, Train, Plane, Car, Navigation } from "lucide-react";

export default async function ReviewPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  const trip = mockData.trips.find(t => t.id === tripId) || mockData.trips[0];

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
        <p className="text-gray-600">思い出の写真と一言感想を残して、ムービーを作ろう！</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-[#1A2B4C] p-4 text-white font-bold">
          {trip.title} の記録
        </div>

        <div className="p-4 md:p-6 space-y-10">
          {trip.spots.map((spot, index) => {
            const isTransit = spot.type === "transit";
            return (
              <div key={spot.id} className="relative pb-10 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-flight text-sm shrink-0 ${isTransit ? 'bg-gray-200 text-gray-600' : 'bg-[#00A4E5] text-white'}`}>
                    {isTransit ? getTransitIcon(spot.icon || "navigation") : index + 1}
                  </div>
                  <h3 className={`font-bold text-lg ${isTransit ? 'text-gray-700' : 'text-[#1A2B4C]'}`}>
                    {spot.name}
                  </h3>
                </div>

                <div className="pl-11 space-y-4">
                  {/* 写真アップロード (移動手段のときは少し控えめに) */}
                  <button className={`h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-colors ${isTransit ? 'w-full md:w-32' : 'w-full md:w-48'}`}>
                    <Camera className="w-6 h-6 mb-2" />
                    <span className="text-sm font-bold">写真を追加</span>
                  </button>

                  {/* 成功コメント */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-[#1A2B4C]">
                      <Smile className="w-4 h-4 text-[#00A4E5]" /> {isTransit ? '移動の工夫・良かったこと' : '楽しかったこと・おすすめ'}
                    </label>
                    <textarea 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A4E5] focus:bg-white transition-all resize-none h-20"
                      placeholder={isTransit ? "例: 一番後ろの席を取ったら気兼ねなく倒せて正解でした" : "例: 子供が遊具で大はしゃぎでした！"}
                      defaultValue={spot.positive || ""}
                    ></textarea>
                  </div>

                  {/* 失敗アラート */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-[#1A2B4C]">
                      <AlertTriangle className="w-4 h-4 text-[#FFD166]" /> 注意点・失敗談（To-Don't）
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs bg-gray-100 border border-gray-200 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-200">
                        {isTransit ? "ベビーカー畳む必要あり" : "トイレ汚い"}
                      </span>
                      <span className="text-xs bg-[#FFD166]/20 border border-[#FFD166]/50 text-amber-900 px-3 py-1 rounded-full cursor-pointer flex items-center gap-1">
                        <Check className="w-3 h-3"/>
                        {isTransit ? "耳抜き対策必須" : "待ち時間長い"}
                      </span>
                    </div>
                    <input 
                      type="text"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD166] focus:bg-white transition-all"
                      placeholder="詳細を記入（任意）"
                      defaultValue={spot.alert || ""}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center space-y-4">
        <Video className="w-8 h-8 text-[#00A4E5] mx-auto" />
        <div>
          <h3 className="font-bold text-[#1A2B4C] mb-1">ムービーを生成して公開する</h3>
          <p className="text-sm text-gray-600">
            アップロードした写真と感想から、BGM付きのショートムービーを作ります。<br/>
            プランは公開され、他のパパママの役に立ちます！
          </p>
        </div>
        <button className="w-full md:w-auto bg-[#00A4E5] text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-md text-lg">
          投稿してムービーを作る
        </button>
      </div>
    </div>
  );
}
