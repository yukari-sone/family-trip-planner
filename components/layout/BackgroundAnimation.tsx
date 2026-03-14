"use client";

import { Cloud, Plane, TrainFront } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackgroundAnimation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydrationエラー防止のため、マウント後に描画
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none bg-gradient-to-b from-sky-100 via-sky-50 to-[#F4F5F7]">
      <style>
        {`
          @keyframes float-cloud {
            0% { transform: translateX(-15vw); }
            100% { transform: translateX(115vw); }
          }
          @keyframes fly-plane {
            0% { transform: translateX(-10vw) translateY(20vh) scale(0.5); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateX(110vw) translateY(-10vh) scale(1.2); opacity: 0; }
          }
          @keyframes run-train {
            0% { transform: translateX(110vw); opacity: 0; }
            5% { opacity: 1; }
            95% { opacity: 1; }
            100% { transform: translateX(-20vw); opacity: 0; }
          }

          .cloud-1 {
            animation: float-cloud 80s linear infinite;
          }
          .cloud-2 {
            animation: float-cloud 120s linear infinite;
            animation-delay: -40s;
          }
          .cloud-3 {
            animation: float-cloud 150s linear infinite;
            animation-delay: -90s;
          }
          .cloud-4 {
            animation: float-cloud 100s linear infinite;
            animation-delay: -10s;
          }

          .animate-plane {
            animation: fly-plane 35s linear infinite;
            animation-delay: 5s;
          }
          .animate-train {
            animation: run-train 25s linear infinite;
            animation-delay: 15s;
          }
        `}
      </style>

      {/* 雲の装飾 */}
      <div className="absolute top-[10%] left-0 text-white/80 cloud-1">
        <Cloud className="w-32 h-32" fill="currentColor" />
      </div>
      <div className="absolute top-[25%] left-0 text-white/60 cloud-2 scale-75">
        <Cloud className="w-40 h-40" fill="currentColor" />
      </div>
      <div className="absolute top-[5%] left-0 text-white/90 cloud-3 scale-125">
        <Cloud className="w-24 h-24" fill="currentColor" />
      </div>
      <div className="absolute top-[40%] left-0 text-white/40 cloud-4">
        <Cloud className="w-48 h-48" fill="currentColor" />
      </div>

      {/* 飛行機のアニメーション (左下から右上へ) */}
      <div className="absolute top-[15%] left-0 text-[#00A4E5]/10 animate-plane">
        <Plane className="w-16 h-16 rotate-45" fill="currentColor" />
      </div>

      {/* 電車のアニメーション (右から左へ) */}
      <div className="absolute bottom-[10%] right-0 text-slate-400/10 animate-train">
        <TrainFront className="w-20 h-20 -scale-x-100" />
      </div>
    </div>
  );
}
