import Link from "next/link";
import { Search, Map, Video, Plane } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      {/* Hero Section (Passport Cover Style) */}
      <section className="relative bg-[#1A2B4C] text-white rounded-3xl p-8 md:p-16 shadow-2xl overflow-hidden border-4 border-[#1A2B4C]/90 min-h-[500px] flex flex-col items-center justify-center text-center mt-4">
        {/* Passport texture/watermark */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
           <div className="w-[150%] h-[150%] border-[40px] border-white/20 rounded-full mix-blend-overlay"></div>
        </div>
        <div className="absolute top-10 flex w-full justify-center opacity-20 pointer-events-none">
          <Plane className="w-48 h-48 -rotate-45" />
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h2 className="text-[#FFD166] font-flight text-sm md:text-base tracking-[0.3em] font-bold">
              OFFICIAL PASSPORT
            </h2>
            <h1 className="text-4xl md:text-6xl font-bold font-flight leading-tight tracking-wider">
              FAMILY TRIP<br />PLANNER
            </h1>
          </div>
          
          <p className="text-lg text-blue-100 max-w-xl mx-auto font-medium leading-relaxed">
            先人の知恵（成功と失敗）を借りて、家族旅行をアップデート。<br/>
            失敗アラートでリスクを回避し、最高な思い出ムービーを作ろう。
          </p>
          
          <div className="pt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/trips"
              className="bg-[#00A4E5] text-white px-8 py-4 rounded-full font-bold hover:bg-blue-500 transition-all shadow-lg flex items-center justify-center gap-3 text-lg hover:scale-105"
            >
              <Search className="w-6 h-6" />
              みんなのプランを探す
            </Link>
          </div>
          
          {/* Quick Search on Top Page */}
          <div className="mt-8 max-w-xl mx-auto">
            <form action="/trips" className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2">
              <input 
                type="text" 
                name="q"
                placeholder="行き先やキーワードで探す..." 
                className="flex-grow bg-transparent text-white placeholder-blue-200 px-4 py-2 focus:outline-none"
              />
              <button type="submit" className="bg-[#FFD166] text-[#1A2B4C] p-3 rounded-full hover:bg-yellow-400 transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Passport Pages Section (White background, looks like open pages) */}
      <section className="bg-[#FAF9F6] rounded-3xl p-8 md:p-12 shadow-inner border-x-8 border-y-2 border-gray-200 relative overflow-hidden">
        {/* Binder middle line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 shadow-[0_0_10px_rgba(0,0,0,0.1)] hidden md:block"></div>
        
        <div className="text-center mb-10 relative z-10">
          <h2 className="text-[#1A2B4C] font-flight text-2xl font-bold tracking-widest border-b-2 border-dashed border-gray-300 inline-block pb-2">
            FEATURES
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          <div className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-5 hover:-translate-y-1 transition-transform relative overflow-hidden">
            {/* Stamp effect */}
            <div className="absolute -right-4 -top-4 w-20 h-20 border-2 border-red-200 rounded-full opacity-20 transform rotate-12 flex items-center justify-center">
              <span className="text-red-200 font-bold text-xs -rotate-12">DEPARTED</span>
            </div>
            
            <div className="w-16 h-16 bg-blue-50 text-[#00A4E5] rounded-full flex items-center justify-center shadow-inner">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-[#1A2B4C] mb-2">探してコピー</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                自分と同じような家族構成の成功プランをコピーして、簡単にカスタマイズ。ゼロから調べる手間を省きます。
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-5 hover:-translate-y-1 transition-transform relative overflow-hidden md:mt-12">
            <div className="w-16 h-16 bg-yellow-50 text-amber-500 rounded-full flex items-center justify-center shadow-inner">
              <Map className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-[#1A2B4C] mb-2">失敗アラート</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                「トイレが汚い」「待ち時間が長い」などのリアルなTo-Don't情報で、現地での予期せぬトラブルを回避します。
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-5 hover:-translate-y-1 transition-transform relative overflow-hidden">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center shadow-inner">
              <Video className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-[#1A2B4C] mb-2">思い出ムービー</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                旅行後に写真と振り返りを投稿するだけで、BGM・アニメーション付きのエモいショートムービーが完成します。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
