import Link from "next/link";
import { mockData } from "@/lib/mock-data";
import { MapPin, Users, Ticket } from "lucide-react";
import Image from "next/image";

export default function TripsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b-2 border-[#1A2B4C] pb-4">
        <h1 className="text-3xl font-bold font-flight">DESTINATIONS</h1>
      </div>

      {/* 簡易検索バー */}
      <div className="bg-white p-4 rounded-xl shadow-sm flex flex-wrap gap-4">
        <input 
          type="text" 
          placeholder="行き先やキーワードを入力..." 
          className="flex-grow border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A4E5]"
        />
        <button className="bg-[#1A2B4C] text-white px-6 py-2 rounded-lg font-bold hover:opacity-90">
          検索
        </button>
      </div>

      {/* プラン一覧 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockData.trips.map((trip) => (
          <Link key={trip.id} href={`/trips/${trip.id}`} className="group">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-200 relative">
              {/* チケットの切り込み風デザイン */}
              <div className="absolute -left-3 top-1/2 w-6 h-6 bg-[#F4F5F7] rounded-full"></div>
              <div className="absolute -right-3 top-1/2 w-6 h-6 bg-[#F4F5F7] rounded-full"></div>
              
              <div className="relative h-48 w-full bg-gray-100">
                <Image
                  src={trip.imageUrl}
                  alt={trip.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 border-t-2 border-dashed border-gray-200 mt-2 space-y-4">
                <div className="flex items-center gap-2 text-sm text-[#00A4E5] font-bold">
                  <Ticket className="w-4 h-4" />
                  BOARDING PASS
                </div>
                <h2 className="font-bold text-lg leading-tight group-hover:text-[#00A4E5] transition-colors line-clamp-2">
                  {trip.title}
                </h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>エリア: {trip.area}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>対象: {trip.targetAges}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
