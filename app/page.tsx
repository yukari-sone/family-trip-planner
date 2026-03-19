import Link from "next/link";
import { Search, Map, Video, Plane, AlertTriangle, CheckCircle, Navigation, Copy, MapPin, Smile } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full bg-[#F4F5F7]">
      {/* 1. ファーストビュー（Heroセクション） */}
      <section className="relative bg-[#1A2B4C] text-white overflow-hidden min-h-[600px] flex items-center">
        {/* 背景の装飾 */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
           <div className="w-[150%] h-[150%] border-[40px] border-white/20 rounded-full mix-blend-overlay"></div>
        </div>
        <div className="absolute top-20 right-10 flex w-full justify-end opacity-20 pointer-events-none">
          <Plane className="w-64 h-64 -rotate-45" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20 text-center md:text-left">
          <div className="max-w-3xl space-y-6">
            <h2 className="text-[#FFD166] font-flight text-sm md:text-base tracking-[0.3em] font-bold inline-block border border-[#FFD166] px-4 py-1 rounded-full">
              DEPARTURE INFORMATION
            </h2>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
              先人の知恵を借りて、<br className="hidden md:block" />家族旅行をアップデートしよう。
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl font-medium leading-relaxed mt-6">
              「トイレが遠い」「ベビーカーが通れない…」<br />
              キラキラしたSNSだけでは分からない、パパママの”リアルな失敗談”を回避して、子どもが最高に笑う旅を作りませんか？
            </p>
            
            <div className="pt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/trips"
                className="bg-[#00A4E5] text-white px-8 py-4 rounded-full font-bold hover:bg-blue-500 transition-all shadow-lg flex items-center justify-center gap-3 text-lg hover:scale-105"
              >
                <Search className="w-6 h-6" />
                無料で次の旅行を探す
              </Link>
            </div>
            
            {/* Quick Search */}
            <div className="mt-8 max-w-xl">
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
        </div>
      </section>

      {/* 2. 共感・課題喚起 */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-12">
          <h2 className="text-3xl font-bold text-[#1A2B4C]">子連れ旅行の計画、<br className="md:hidden"/>こんな「あるある」に疲れていませんか？</h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex gap-4 items-start">
              <div className="bg-blue-50 p-3 rounded-full shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-gray-700 font-medium">インスタで見た絶景スポット。行ってみたら階段だらけでベビーカーを担ぐハメに…</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex gap-4 items-start">
              <div className="bg-blue-50 p-3 rounded-full shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-gray-700 font-medium">「子ども歓迎」のレストランなのに、おむつ替えスペースがなくて大慌て。</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex gap-4 items-start">
              <div className="bg-blue-50 p-3 rounded-full shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-gray-700 font-medium">大人の旅行とは見るべきポイント（トイレ、待ち時間、食事）が違いすぎて、リサーチだけでヘトヘト。</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex gap-4 items-start">
              <div className="bg-blue-50 p-3 rounded-full shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-gray-700 font-medium">帰ってきたらクタクタ。旅行の写真を整理して動画を作る余裕なんてない！</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 解決策の提示 */}
      <section className="relative text-white py-40 px-4 overflow-hidden min-h-[500px] flex items-end">
        {/* 背景画像 (パパ、ママ、子供が旅行先で笑っている画像) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
          alt="家族旅行の笑顔" 
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
        
        {/* 画像の人物をしっかり見せつつ、文字を読みやすくするためのグラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1A2B4C] z-0"></div>
        <div className="absolute inset-0 bg-black/20 z-0"></div>

        <div className="container mx-auto max-w-4xl text-center space-y-6 relative z-10">
          <Plane className="w-12 h-12 mx-auto opacity-90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
          <h2 className="text-2xl md:text-3xl font-bold leading-relaxed drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] text-white">
            「FamilyTrip Planner」は、同年代の子どもを持つパパママのリアルな体験から、<br className="hidden md:block" />
            ”失敗しない”旅程を簡単にコピー＆編集できるサービスです。
          </h2>
        </div>
      </section>

      {/* 4. 選ばれる4つの理由 */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-5xl space-y-16">
          <div className="text-center">
            <h2 className="text-[#1A2B4C] font-flight text-sm md:text-base tracking-[0.2em] font-bold border-b-2 border-[#FFD166] inline-block pb-2 mb-4">FEATURES</h2>
            <h3 className="text-3xl font-bold text-[#1A2B4C]">選ばれる4つの理由</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* 理由1 */}
            <div className="space-y-4 relative group">
              <div className="absolute -left-6 -top-6 text-8xl font-black text-gray-50 opacity-50 z-0 group-hover:scale-110 transition-transform">1</div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                  <Copy className="w-7 h-7 text-[#00A4E5]" />
                </div>
                <h4 className="text-xl font-bold text-[#1A2B4C]">他の家族の「成功プラン」を<br/>1クリックでコピー！</h4>
                <p className="text-gray-600 leading-relaxed mt-3">
                  ゼロから旅行の計画を立てる必要はありません。「3歳児・沖縄3泊4日」など、自分と似た家族構成の先輩パパママが作ったプランを検索し、そのまま自分のアカウントにコピー。あとは好みに合わせて順番や時間を入れ替えるだけ！
                </p>
              </div>
            </div>

            {/* 理由2 */}
            <div className="space-y-4 relative group">
              <div className="absolute -left-6 -top-6 text-8xl font-black text-gray-50 opacity-50 z-0 group-hover:scale-110 transition-transform">2</div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-amber-100">
                  <AlertTriangle className="w-7 h-7 text-amber-500" />
                </div>
                <h4 className="text-xl font-bold text-[#1A2B4C]">SNSでは見えない<br/>「失敗アラート（To-Don't）」でトラブル回避</h4>
                <p className="text-gray-600 leading-relaxed mt-3">
                  「ここは12時に行くと1時間待ち！」「このルートはトイレが汚いから注意」など、実際に行ったからこそ分かるリアルな失敗情報がタイムライン上に表示されます。地雷を避けて、安全・安心な旅を実現します。
                </p>
              </div>
            </div>

            {/* 理由3 */}
            <div className="space-y-4 relative group">
              <div className="absolute -left-6 -top-6 text-8xl font-black text-gray-50 opacity-50 z-0 group-hover:scale-110 transition-transform">3</div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
                  <MapPin className="w-7 h-7 text-emerald-500" />
                </div>
                <h4 className="text-xl font-bold text-[#1A2B4C]">作ったプランはGoogleマイマップへ<br/>即書き出し（KML出力）</h4>
                <p className="text-gray-600 leading-relaxed mt-3">
                  完成した旅程は、使い慣れたGoogleマイマップへボタン一つでエクスポート可能。旅行当日はスマホのGoogleマップを見るだけでスムーズにナビゲーションできます。子どもが喜ぶ「旅のしおり（PDF）」も自動生成！
                </p>
              </div>
            </div>

            {/* 理由4 */}
            <div className="space-y-4 relative group">
              <div className="absolute -left-6 -top-6 text-8xl font-black text-gray-50 opacity-50 z-0 group-hover:scale-110 transition-transform">4</div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-purple-100">
                  <Video className="w-7 h-7 text-purple-500" />
                </div>
                <h4 className="text-xl font-bold text-[#1A2B4C]">写真と感想を入れるだけ！<br/>「思い出ムービー」を自動生成</h4>
                <p className="text-gray-600 leading-relaxed mt-3">
                  旅行が終わったら、スポットごとに写真と一言感想をアップロードするだけ。BGMとアニメーション付きのエモい「ショートムービー」が自動で出来上がります。動画編集のスキルがなくても、成長記録を素敵な形に残せます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 利用者の声 */}
      <section className="py-20 px-4 bg-[#F4F5F7]">
        <div className="container mx-auto max-w-4xl space-y-12">
          <div className="text-center">
            <h2 className="text-[#1A2B4C] font-flight text-sm md:text-base tracking-[0.2em] font-bold border-b-2 border-[#00A4E5] inline-block pb-2 mb-4">VOICE</h2>
            <h3 className="text-3xl font-bold text-[#1A2B4C]">ご利用パパママの声</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm relative">
              <div className="absolute -top-4 -right-4 text-6xl text-[#00A4E5] opacity-20 font-serif">"</div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">👩</div>
                <div>
                  <p className="font-bold text-[#1A2B4C]">30代ママ</p>
                  <p className="text-sm text-gray-500">お子様: 4歳・1歳</p>
                </div>
              </div>
              <h4 className="font-bold text-lg mb-2 text-[#00A4E5]">「事前の失敗アラートに救われました！」</h4>
              <p className="text-gray-700 leading-relaxed text-sm">
                「テーマパークのレストランが激混みするから時間をずらすべき」というアラートのおかげで、子どものぐずりを回避できました！丸ごとコピーしたプランのおかげで計画の時間が半分以下になり大助かりです。
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm relative">
              <div className="absolute -top-4 -right-4 text-6xl text-[#00A4E5] opacity-20 font-serif">"</div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">👨</div>
                <div>
                  <p className="font-bold text-[#1A2B4C]">40代パパ</p>
                  <p className="text-sm text-gray-500">お子様: 7歳</p>
                </div>
              </div>
              <h4 className="font-bold text-lg mb-2 text-[#00A4E5]">「帰ってからの動画生成がご褒美です」</h4>
              <p className="text-gray-700 leading-relaxed text-sm">
                いつも旅行後は疲れ切って写真がカメラロールに眠ったままでしたが、感想を入れるだけで素敵なBGM付き動画が完成。おじいちゃんおばあちゃんにも喜んでシェアしています！
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. クロージング (CTA) */}
      <section className="relative bg-[#1A2B4C] text-white py-24 px-4 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
           <div className="w-[150%] h-[150%] border-[40px] border-white/20 rounded-full mix-blend-overlay"></div>
        </div>
        
        {/* パスポートスタンプ装飾 */}
        <div className="absolute top-10 right-10 md:right-32 w-32 h-32 border-4 border-red-400/30 rounded-full opacity-40 transform rotate-12 flex items-center justify-center">
          <div className="text-red-400/30 font-bold text-lg -rotate-12 border-y-2 border-red-400/30 py-1">APPROVED</div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            失敗を恐れず、<br />子どもとの旅行を最大限楽しもう。
          </h2>
          <p className="text-lg text-blue-100 leading-relaxed">
            あなたの経験（成功も失敗も）が、明日の誰かの家族旅行を救うパスポートになります。<br />
            さあ、次の目的地はどこですか？
          </p>
          
          <div className="pt-6">
            <Link
              href="/trips"
              className="inline-flex bg-[#FFD166] text-[#1A2B4C] px-10 py-5 rounded-full font-bold hover:bg-yellow-400 transition-all shadow-xl items-center justify-center gap-3 text-xl hover:scale-105"
            >
              <Navigation className="w-6 h-6" />
              無料で登録してプランを探す
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
