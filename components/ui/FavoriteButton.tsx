"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavoriteAction } from "@/app/actions/favorite";

export function FavoriteButton({ 
  tripId, 
  initialIsFavorite, 
  size = "md" 
}: { 
  tripId: string, 
  initialIsFavorite: boolean,
  size?: "sm" | "md" | "lg"
}) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // リンククリックイベントを伝播させない
    e.stopPropagation(); // これを追加：親要素のLinkへのクリックイベントも止める
    
    // UIを即座に更新 (Optimistic UI)
    setIsFavorite(!isFavorite);
    
    // サーバーに更新リクエスト
    startTransition(async () => {
      try {
        const result = await toggleFavoriteAction(tripId);
        // 万が一サーバーの結果と異なった場合は元に戻す
        setIsFavorite(result.isFavorite);
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
        // エラー時は元に戻す
        setIsFavorite(isFavorite);
      }
    });
  };

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all shadow-sm z-10 ${
        isFavorite 
          ? "bg-red-50 hover:bg-red-100 border border-red-100" 
          : "bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200"
      }`}
      aria-label={isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
    >
      <Heart 
        className={`${iconSizes[size]} transition-all ${
          isFavorite 
            ? "fill-red-500 text-red-500 scale-110" 
            : "text-gray-400 hover:text-gray-600 scale-100"
        } ${isPending ? "opacity-50" : ""}`} 
      />
    </button>
  );
}
