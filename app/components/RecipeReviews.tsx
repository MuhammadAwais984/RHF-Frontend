"use client";

import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";

export default function RecipeReviews({ recipeId }: { recipeId: number }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API = process.env.NEXT_PUBLIC_STRAPI_URL + "/api";

  useEffect(() => {
    if (!recipeId) return;

    fetch(
      `${API}/reviews?filters[recipe][id][$eq]=${recipeId}&filters[statu][$eq]=APPROVED&sort=createdAt:desc`,
      { cache: "no-store" },
    )
      .then((res) => res.json())
      .then((data) => {
        setReviews(data?.data || []); // ⚠️ fallback to empty array
        setLoading(false);
      })
      .catch(() => setReviews([]));
  }, [recipeId]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-200 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <CalendarIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">
          No reviews yet. Be the first to share your thoughts!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h2 className="text-4xl font-serif italic text-stone-800 mb-6 gap-2">
        Community Reviews
        <span className="text-sm font-sans font-normal text-stone-400">
          ({reviews.length})
        </span>
      </h2>

      <div className="space-y-8">
        {reviews.map((r) => (
          <div key={r.id} className="group flex gap-4 transition-all">
            {/* Avatar Decoration */}
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-red-100 to-orange-100 flex items-center justify-center border-2 border-white shadow-sm">
                <span className="text-red-600 font-bold text-lg uppercase">
                  {r.name.charAt(0)}
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm group-hover:shadow-md group-hover:border-red-100 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-900 leading-tight">
                  {r.name}
                </h4>
                <div className="flex items-center text-xs text-gray-400">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {new Date(r.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed text-sm italic">
                "{r.comment}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
