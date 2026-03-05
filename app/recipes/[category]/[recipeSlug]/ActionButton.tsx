"use client";

import { useEffect, useState } from "react";
import { Heart, Star, Share2, Check, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface RecipeActionsProps {
  recipeId: number;
}

export default function RecipeActions({ recipeId }: RecipeActionsProps) {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const [favorites, setFavorites] = useState<number | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [rated, setRated] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    const loadFavorites = async () => {
      const res = await fetch(`${API}/recipes/${recipeId}/favorite-count`, {
        cache: "no-store", // always fresh
      });

      const data = await res.json();
      setFavorites(data.favoritesCount);
    };

    loadFavorites();
  }, [recipeId]);

  if (!mounted || favorites === null) return null;

  const handleFavorite = async () => {
    try {
      const res = await fetch(`${API}/recipes/${recipeId}/favorite`, {
        method: "PATCH",
      });
      const data = await res.json();
      setFavorites(data.favoritesCount);
      setIsFavorited(true);
    } catch (err) {
      console.error("Favorite failed", err);
    }
  };

  const handleRate = async (value: number) => {
    if (rated) return;
    setRating(value);
    setRated(true);
    await fetch(`${API}/recipes/${recipeId}/rate`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: value }),
    });
    router.refresh();
  };

  const handleShare = async () => {
    try {
      await fetch(`${API}/recipes/${recipeId}/share`, { method: "PATCH" });
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="flex flex-wrap items-center  gap-4 md:gap-8 py-3 px-5 md:px-8 backdrop-blur-xl shadow-xl shadow-stone-200/40 w-fit transition-all duration-500 hover:shadow-2xl hover:shadow-stone-200/60">
      {/* 1. FAVORITE ACTION */}
      <button
        onClick={handleFavorite}
        className="group flex flex-col items-center gap-1.5 transition-all active:scale-90"
      >
        <div
          className={`relative p-2.5 rounded-2xl transition-all duration-300 ${
            isFavorited
              ? "bg-red-500 text-white shadow-lg shadow-red-200"
              : "bg-stone-50 text-stone-400 group-hover:bg-red-50 group-hover:text-red-400"
          }`}
        >
          <Heart
            size={20}
            className={`transition-all duration-300 ${isFavorited ? "fill-white" : ""}`}
          />
          {isFavorited && (
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-red-300 animate-pulse" />
          )}
        </div>
        <span
          className={`text-[10px] font-black uppercase tracking-tighter ${isFavorited ? "text-red-600" : "text-stone-400"}`}
        >
          {favorites} Liked
        </span>
      </button>

      <div className="h-10 w-[1px] bg-stone-200/60 hidden sm:block" />

      {/* 2. RATING ACTION */}
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex items-center bg-stone-50 px-2 py-1.5 rounded-2xl border border-stone-100/50">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => !rated && setHoveredRating(star)}
              onMouseLeave={() => !rated && setHoveredRating(0)}
              onClick={() => handleRate(star)}
              className={`p-1 transition-all duration-300 ${!rated ? "hover:scale-125 active:scale-75" : "cursor-default"}`}
              disabled={rated}
            >
              <Star
                size={20}
                className={`transition-all duration-300 ${
                  star <= (hoveredRating || rating)
                    ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                    : "text-stone-200"
                }`}
              />
            </button>
          ))}
        </div>
        <span className="text-[10px] font-black text-stone-400 uppercase tracking-tighter">
          {rated ? "Rated!" : "Rate recipe"}
        </span>
      </div>

      <div className="h-10 w-[1px] bg-stone-200/60 hidden sm:block" />

      {/* 3. SHARE ACTION */}
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={handleShare}
          className={`relative h-11 px-6 rounded-2xl transition-all duration-500 font-bold text-sm flex items-center gap-2 overflow-hidden shadow-lg active:scale-95 ${
            shared
              ? "bg-emerald-500 text-white shadow-emerald-200"
              : "bg-stone-900 text-white shadow-stone-300 hover:bg-stone-800"
          }`}
        >
          <div
            className={`transition-all duration-300 flex items-center gap-2 ${shared ? "translate-y-0" : ""}`}
          >
            {shared ? (
              <Check size={18} strokeWidth={3} />
            ) : (
              <Share2 size={18} />
            )}
            <span>{shared ? "Copied" : "Share"}</span>
          </div>
        </button>
        <span className="text-[10px] font-black text-stone-400 uppercase tracking-tighter">
          Send to friends
        </span>
      </div>
    </div>
  );
}
