import Link from "next/link";
import Image from "next/image";
import { mockData } from "@/lib/mock-data";
import { MapPin, Users, Download, FileText, Plus, AlertTriangle, Smile, Train, Plane, Car, Navigation } from "lucide-react";

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = mockData.trips.find(t => t.id === id) || mockData.trips[0];

  const getTransitIcon = (iconStr: string) => {
    switch (iconStr) {
      case "train": return <Train className="w-5 h-5 text-gray-500" />;
      case "plane": return <Plane className="w-5 h-5 text-gray-500" />;
      case "car": return <Car className="w-5 h-5 text-gray-500" />;
      default: return <Navigation className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* ヘッダー画像 */}
      <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-lg">
        <Image src={trip.imageUrl} alt={trip.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-6 left-6 text-white space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">{trip.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm font-medium">
            <span className="flex items-center gap-1"><Users className="w-4 h-4"/> 作成者: {trip.author}</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4"/> 対象: {trip.targetAges}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {trip.area}</span>
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex flex-wrap gap-3">
        <button className="flex-1 bg-white border border-gray-200 text-[#1A2B4C] px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 shadow-sm">
          <Download className="w-5 h-5" /> KML出力
        </button>
        <button className="flex-1 bg-white border border-gray-200 text-[#1A2B4C] px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 shadow-sm">
          <FileText className="w-5 h-5" /> しおり出力
        </button>
        <Link href={`/trips/${trip.id}/edit`} className="flex-[2] bg-[#00A4E5] text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 shadow-sm transition-colors">
          <Plus className="w-5 h-5" /> このプランをCOPY
        </Link>
      </div>

      {/* タイムライン */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-8">
        <h2 className="text-xl font-bold border-b pb-4 mb-6">タイムライン</h2>
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          
          {trip.spots.map((spot, index) => {
            const isTransit = spot.type === "transit";
            return (
              <div key={spot.id} className="relative flex items-start md:justify-center">
                {/* 時間ラベル */}
                <div className="hidden md:flex w-24 justify-end pr-8 pt-1">
                  <span className={`font-flight text-sm font-bold ${isTransit ? 'text-gray-400' : 'text-gray-500'}`}>
                    {spot.time}
                  </span>
                </div>
                
                {/* タイムラインピン */}
                <div className={`absolute left-0 md:relative md:left-auto flex items-center justify-center rounded-full z-10 shadow-sm
                  ${isTransit ? 'w-8 h-8 md:ml-1 bg-gray-100 border-2 border-gray-300 translate-x-1 md:translate-x-0' : 'w-10 h-10 bg-white border-4 border-[#00A4E5]'}`}
                >
                  {isTransit ? getTransitIcon(spot.icon || "navigation") : <MapPin className="w-4 h-4 text-[#00A4E5]" />}
                </div>

                {/* コンテンツ */}
                <div className="w-full pl-14 md:pl-8 md:w-[calc(50%-2.5rem)] md:pb-8">
                  <div className={`rounded-xl p-5 shadow-sm border ${isTransit ? 'bg-gray-50/50 border-dashed border-gray-200' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="md:hidden font-flight text-xs font-bold text-gray-500 mb-1">{spot.time}</div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      {isTransit && getTransitIcon(spot.icon || "navigation")}
                      <h3 className={`font-bold ${isTransit ? 'text-base text-gray-700' : 'text-lg text-[#1A2B4C]'}`}>
                        {spot.name}
                      </h3>
                    </div>
                    
                    {spot.positive && (
                      <div className="flex items-start gap-2 text-sm text-gray-700 bg-blue-50/50 p-3 rounded-lg mt-2">
                        <Smile className="w-5 h-5 text-[#00A4E5] shrink-0" />
                        <p>{spot.positive}</p>
                      </div>
                    )}

                    {spot.alert && (
                      <div className="flex items-start gap-2 text-sm text-amber-900 bg-[#FFD166]/20 p-3 rounded-lg mt-2 border border-[#FFD166]/50">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                        <p className="font-medium">【注意】 {spot.alert}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}
