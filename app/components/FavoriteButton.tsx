"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface Props {
  recipeId: number;
  initialCount: number;
}

export default function FavoriteButton({ recipeId, initialCount }: Props) {
  const [count, setCount] = useState(initialCount);
  const [isFavorited, setIsFavorited] = useState(false); // Track state locally
  const [loading, setLoading] = useState(false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if wrapped in a Link
    if (loading) return;

    // Optimistic UI Update: Make it feel instant
    const previousCount = count;
    const previousStatus = isFavorited;

    setCount(isFavorited ? count - 1 : count + 1);
    setIsFavorited(!isFavorited);
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/recipes/${recipeId}/favorite`,
        { method: "POST" },
      );

      if (!res.ok) throw new Error();
      const data = await res.json();
      setCount(data.favouritesCount);
    } catch (error) {
      // Rollback on failure
      setCount(previousCount);
      setIsFavorited(previousStatus);
      console.error("Favorite failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFavorite}
      disabled={loading}
      className={`
        group flex items-center gap-2 px-3 py-1.5 rounded-full 
        backdrop-blur-md border transition-all duration-300 active:scale-90
        ${
          isFavorited
            ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm"
            : "bg-white/80 border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-white shadow-sm"
        }
      `}
    >
      <div className="relative">
        <Heart
          size={16}
          className={`
            transition-all duration-500 
            ${isFavorited ? "fill-rose-600 scale-110" : "fill-transparent group-hover:scale-110"}
          `}
        />
        {/* Subtle "ping" animation when favorited */}
        {isFavorited && (
          <span className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-20" />
        )}
      </div>

      <span className="text-[11px] font-black uppercase tracking-wider">
        {count.toLocaleString()}
      </span>
    </button>
  );
}
