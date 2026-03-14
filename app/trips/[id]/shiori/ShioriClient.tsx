"use client";

import { useState, useRef } from "react";
import { Printer, ArrowLeft, Image as ImageIcon, Map } from "lucide-react";
import Link from "next/link";

export function ShioriClient({ trip, spots }: { trip: any, spots: any[] }) {
  const [childName, setChildName] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  // 行き先からテーマカラーやイラストを決定する簡易ロジック
  const getTheme = (area: string) => {
    const areaLower = area.toLowerCase();
    if (areaLower.includes("北海道") || areaLower.includes("雪")) {
      return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", emoji: "⛄️🐻❄️" };
    }
    if (areaLower.includes("沖縄") || areaLower.includes("海")) {
      return { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-800", emoji: "🏖️🐠🌺" };
    }
    if (areaLower.includes("京都") || areaLower.includes("奈良")) {
      return { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", emoji: "⛩️🍁🍵" };
    }
    if (areaLower.includes("東京") || areaLower.includes("都会")) {
      return { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-800", emoji: "🗼🚄🏙️" };
    }
    if (areaLower.includes("山") || areaLower.includes("キャンプ")) {
      return { bg: "bg-green-50", border: "border-green-200", text: "text-green-800", emoji: "⛺️🏔️🌳" };
    }
    return { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-800", emoji: "🎒🚂🍙" };
  };

  const theme = getTheme(trip.area);

  return (
    <div className="max-w-4xl mx-auto pb-20 print:p-0 print:m-0 print:max-w-none">
      {/* 画面上部のアクションバー（印刷時には非表示） */}
      <div className="print:hidden mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/trips/${trip.id}`} className="text-gray-500 hover:text-[#1A2B4C] transition-colors p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-xl text-[#1A2B4C]">しおりを作る</h1>
          </div>
          <button 
            onClick={handlePrint}
            className="bg-[#00A4E5] text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Printer className="w-5 h-5" />
            PDFで保存 / 印刷
          </button>
        </div>

        <div className="bg-[#F4F5F7] p-4 rounded-xl">
          <label className="block text-sm font-bold text-[#1A2B4C] mb-2">
            表紙に入れるおなまえ（ひらがながおすすめ！）
          </label>
          <input 
            type="text" 
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="例：たろうくん・はなちゃん"
            className="w-full md:w-1/2 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#00A4E5] font-bold text-lg"
          />
          <p className="text-xs text-gray-500 mt-2">
            ※印刷時に「背景のグラデーション」を含める設定にすると可愛く印刷されます。<br/>
            ※Chromeの場合は印刷設定の「背景のグラフィック」にチェックを入れてください。
          </p>
        </div>
      </div>

      {/* 印刷用コンテンツ */}
      <div ref={contentRef} className="print:block space-y-8">
        {/* 表紙 */}
        <div className={`aspect-[1/1.414] w-full max-w-2xl mx-auto rounded-3xl ${theme.bg} ${theme.border} border-8 p-12 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-lg print:shadow-none print:rounded-none print:border-0 print:w-[210mm] print:h-[297mm] print:max-w-none print:page-break-after-always print:bg-white`}>
          <div className="absolute top-10 left-10 text-6xl opacity-20 transform -rotate-12">{theme.emoji.slice(0,2)}</div>
          <div className="absolute bottom-20 right-10 text-6xl opacity-20 transform rotate-12">{theme.emoji.slice(2,4)}</div>
          <div className="absolute top-20 right-20 text-6xl opacity-20 transform rotate-45">{theme.emoji.slice(4,6)}</div>
          
          <div className={`w-full max-w-md bg-white/80 backdrop-blur-sm p-10 rounded-3xl border-4 ${theme.border} shadow-sm z-10 space-y-8`}>
            <div className={`text-2xl font-bold tracking-widest ${theme.text}`}>
              たのしい りょこう の しおり
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
              {trip.title}
            </h1>
            
            <div className="flex items-center justify-center gap-2 text-xl text-gray-600 font-bold bg-white px-6 py-3 rounded-full shadow-inner border border-gray-100">
              <Map className="w-6 h-6" /> {trip.area} {theme.emoji}
            </div>
            
            <div className="pt-8 border-t-2 border-dashed border-gray-300">
              <p className="text-gray-500 font-bold mb-2">おなまえ</p>
              <div className="text-3xl font-bold text-[#1A2B4C] border-b-2 border-[#1A2B4C] px-4 py-2 inline-block min-w-[200px]">
                {childName || "　　　　　　　　　"}
              </div>
            </div>
          </div>
        </div>

        {/* スケジュール（中身） */}
        <div className={`w-full max-w-2xl mx-auto rounded-3xl bg-white border-4 ${theme.border} p-8 md:p-12 shadow-lg print:shadow-none print:rounded-none print:border-0 print:w-[210mm] print:h-auto print:min-h-[297mm] print:max-w-none print:m-0`}>
          <div className={`text-center mb-10 pb-4 border-b-4 border-dashed ${theme.border}`}>
            <h2 className={`text-3xl font-extrabold ${theme.text}`}>
              スケジュールとミッション！
            </h2>
            <p className="text-gray-500 font-bold mt-2">ミッションをクリアしたらチェック（✓）をつけよう！</p>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[35px] before:h-full before:w-1 before:bg-gray-200">
            {spots.map((spot, index) => {
              const isTransit = spot.type === "transit";
              const displayTime = spot.start_time ? spot.start_time.substring(0, 5) : "";
              
              return (
                <div key={spot.id} className="relative flex items-start pl-20 break-inside-avoid">
                  {/* チェックボックス / 番号 */}
                  <div className={`absolute left-0 top-1 w-16 h-16 rounded-full border-4 flex items-center justify-center bg-white z-10
                    ${isTransit ? 'border-gray-300 text-gray-400' : `${theme.border} ${theme.text}`}`}>
                    <span className="text-2xl font-bold">{index + 1}</span>
                  </div>

                  <div className={`w-full rounded-2xl p-5 border-2 ${isTransit ? 'border-dashed border-gray-300 bg-gray-50' : 'border-gray-200 bg-white shadow-sm'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      {displayTime && (
                        <span className={`font-flight text-lg font-bold px-3 py-1 rounded-lg ${isTransit ? 'bg-gray-200 text-gray-600' : 'bg-gray-100 text-[#1A2B4C]'}`}>
                          {displayTime}
                        </span>
                      )}
                      <h3 className={`font-bold text-xl md:text-2xl ${isTransit ? 'text-gray-600' : 'text-[#1A2B4C]'}`}>
                        {spot.place_name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="w-10 h-10 rounded-xl border-4 border-gray-300 bg-white"></div>
                      <span className="text-gray-500 font-bold">← ついたらチェック！</span>
                    </div>

                    {(spot.positive_comment || spot.failure_alert) && (
                      <div className="mt-4 bg-[#FFF9E6] border border-[#FFD166] rounded-xl p-4">
                        <p className="font-bold text-amber-800 text-sm mb-1">【パパ・ママからのメモ】</p>
                        {spot.positive_comment && <p className="text-amber-900">• {spot.positive_comment}</p>}
                        {spot.failure_alert && <p className="text-amber-900">• {spot.failure_alert}</p>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-16 text-center">
            <div className={`inline-block border-4 ${theme.border} rounded-3xl p-6 bg-white`}>
              <h3 className={`text-2xl font-bold ${theme.text} mb-2`}>やくそく</h3>
              <ul className="text-left text-lg font-bold text-gray-700 space-y-2">
                <li>1. パパ・ママのいうことをきく</li>
                <li>2. まいごにならないように手をつなぐ</li>
                <li>3. おもいっきりたのしむ！</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}