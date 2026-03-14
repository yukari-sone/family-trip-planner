import Link from "next/link";
import { MapPin, Users, Ticket, Plane } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ensureSupabaseUser } from "@/lib/supabase/auth-helpers";
import { FavoriteButton } from "@/components/ui/FavoriteButton";

export default async function TripsPage(props: { searchParams?: Promise<{ q?: string }> }) {
  const supabase = await createClient();
  const user = await ensureSupabaseUser();
  const searchParams = await props.searchParams;
  const searchQuery = searchParams?.q || "";
  
  // 公開されているプラン一覧を取得
  let query = supabase
    .from("trips")
    .select(`
      id,
      title,
      area,
      target_ages,
      image_url,
      created_at,
      users:user_id (
        display_name
      )
    `)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,area.ilike.%${searchQuery}%`);
  }

  const { data: trips } = await query;

  const publicTrips = trips || [];

  // ユーザーがログインしている場合、お気に入り情報を取得
  let userFavorites = new Set();
  if (user) {
    const { data: favorites } = await supabase
      .from('favorites')
      .select('trip_id')
      .eq('user_id', user.id);
      
    if (favorites) {
      userFavorites = new Set(favorites.map(f => f.trip_id));
    }
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between border-b-2 border-[#1A2B4C] pb-4">
        <h1 className="text-3xl font-bold font-flight">DESTINATIONS</h1>
      </div>

      {/* 簡易検索バー */}
      <form className="bg-white p-4 rounded-xl shadow-sm flex flex-wrap gap-4" action="/trips">
        <input 
          type="text" 
          name="q"
          defaultValue={searchQuery}
          placeholder="行き先やキーワードを入力..." 
          className="flex-grow border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A4E5]"
        />
        <button type="submit" className="bg-[#1A2B4C] text-white px-6 py-2 rounded-lg font-bold hover:opacity-90">
          検索
        </button>
        {searchQuery && (
          <Link href="/trips" className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-300 flex items-center justify-center">
            クリア
          </Link>
        )}
      </form>

      {/* プラン一覧 */}
      {publicTrips.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <Plane className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-bold">まだ公開されているプランがありません。<br/>最初のプランを作ってみましょう！</p>
          <Link href="/trips/new" className="inline-block mt-4 text-[#00A4E5] font-bold hover:underline">
            プランを作成する
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicTrips.map((trip) => (
            <Link key={trip.id} href={`/trips/${trip.id}`} className="group">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-200 relative h-full flex flex-col">
                {/* チケットの切り込み風デザイン */}
                <div className="absolute -left-3 top-48 w-6 h-6 bg-[#F4F5F7] rounded-full z-10"></div>
                <div className="absolute -right-3 top-48 w-6 h-6 bg-[#F4F5F7] rounded-full z-10"></div>
                
                <div className="relative h-48 w-full bg-gray-200 flex items-center justify-center shrink-0">
                  {trip.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={trip.image_url}
                      alt={trip.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Plane className="w-12 h-12 text-gray-400 group-hover:scale-110 transition-transform duration-500" />
                  )}
                  
                  {/* お気に入りボタン */}
                  {user && (
                    <div className="absolute top-3 right-3">
                      <FavoriteButton tripId={trip.id} initialIsFavorite={userFavorites.has(trip.id)} size="sm" />
                    </div>
                  )}
                </div>
                <div className="p-5 border-t-2 border-dashed border-gray-200 mt-2 space-y-4 flex-grow flex flex-col">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-[#00A4E5] font-bold">
                      <Ticket className="w-4 h-4" />
                      BOARDING PASS
                    </div>
                    <div className="text-gray-400 font-flight text-xs">
                      {new Date(trip.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <h2 className="font-bold text-lg leading-tight group-hover:text-[#00A4E5] transition-colors line-clamp-2">
                    {trip.title}
                  </h2>
                  <div className="space-y-2 text-sm text-gray-600 mt-auto pt-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-medium truncate">{trip.area}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{trip.target_ages || "指定なし"}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-[10px]">👤</span>
                    </div>
                    {/* @ts-ignore */}
                    <span className="truncate">作成者: {trip.users?.display_name || "ゲスト"}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
