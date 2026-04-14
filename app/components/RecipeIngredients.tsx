"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

interface Ingredient {
  id: string;
  ingredientName: string;
  quantity: string;
  unit: string;
  imageUrl?: string;
  altText?: string;
  preparationNote?: string;
}

interface IngredientsProps {
  ingredients: Ingredient[];
}

const INITIAL_SHOW = 5;

export default function Ingredients({ ingredients }: IngredientsProps) {
  const [expanded, setExpanded] = useState(false);

  // When expanded, we show everything. When not, we slice.
  const visible = expanded ? ingredients : ingredients.slice(0, INITIAL_SHOW);
  const hasMore = ingredients.length > INITIAL_SHOW;
  const hiddenCount = ingredients.length - INITIAL_SHOW;

  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-10 antialiased">
      <div className="flex flex-col gap-8">
        {/* ── Header ── */}
        <div className="border-b border-stone-100 flex flex-row items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-4xl font-semibold text-stone-900 tracking-tight">
              Ingredients
            </h2>
          </div>
          <div className="h-px flex-1 bg-stone-200" />

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-2">
            <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500 bg-stone-50 border border-stone-200 px-4 py-2 rounded-full shadow-sm text-center">
              {ingredients.length} Total Ingredients
            </span>
          </div>
        </div>

        {/* ── Main Card ── */}
        <div className="bg-white rounded-2xl overflow-hidden transition-all duration-500 ease-in-out">
          {/* ── Ingredient List ── */}
          <ul className="divide-y divide-stone-50 px-4 md:px-6 py-2">
            {visible.map((ing, i) => (
              <li
                key={ing.id}
                className="group flex items-center gap-4 py-3.5 px-2 transition-colors duration-200 hover:bg-stone-50/60 rounded-xl"
                style={{
                  // Staggered animation only for the newly revealed items
                  animation:
                    expanded && i >= INITIAL_SHOW
                      ? `fadeSlideIn 0.4s cubic-bezier(0.21, 1.02, 0.73, 1) both`
                      : undefined,
                  animationDelay:
                    expanded && i >= INITIAL_SHOW
                      ? `${(i - INITIAL_SHOW) * 60}ms`
                      : undefined,
                }}
              >
                {/* Image / Fallback */}
                <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-stone-100 ring-1 ring-stone-200/50 transition-transform duration-300 group-hover:scale-105">
                  {ing.imageUrl ? (
                    <Image
                      src={ing.imageUrl}
                      alt={ing.altText ?? ing.ingredientName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-stone-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 3v1m0 16v1M4.22 4.22l.707.707M18.364 18.364l.707.707M3 12H2m20 0h-1M4.927 19.073l.707-.707M18.364 5.636l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Name + prep note */}
                <div className="flex-1 min-w-0">
                  <span className="text-[15px] font-medium text-stone-800 truncate block leading-snug">
                    {ing.ingredientName}
                  </span>
                  {ing.preparationNote && (
                    <p className="text-xs text-stone-400 italic mt-0.5 truncate">
                      {ing.preparationNote}
                    </p>
                  )}
                </div>

                {/* Dotted rule */}
                <div className="hidden sm:block flex-grow border-b border-dotted border-stone-200 mx-2" />

                {/* Quantity badge */}
                <span className="shrink-0 text-sm font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg tabular-nums transition-colors group-hover:bg-stone-900 group-hover:text-white">
                  {ing.quantity} {ing.unit}
                </span>
              </li>
            ))}
          </ul>

          {/* ── Show More / Less Button ── */}
          {hasMore && (
            <div className="px-6 pb-5 pt-1">
              <div className="h-px bg-stone-100 mb-4" />
              <button
                onClick={() => setExpanded((prev) => !prev)}
                className="
                  w-full flex items-center justify-center gap-2.5
                  py-4 px-4
                  rounded-xl
                  border border-stone-200
                  bg-stone-50
                  text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400
                  hover:bg-stone-100 hover:border-stone-300 hover:text-stone-900
                  transition-all duration-300
                  group/btn
                "
              >
                <div className="h-[1px] w-8 bg-stone-200 group-hover/btn:w-12 transition-all" />

                {expanded
                  ? "Collapse"
                  : `View ${hiddenCount} more ingredient${hiddenCount > 1 ? "s" : ""}`}

                <div
                  className={`transition-transform duration-500 ${expanded ? "rotate-180" : ""}`}
                >
                  <ChevronDownIcon className="w-3.5 h-3.5 text-amber-600" />
                </div>

                <div className="h-[1px] w-8 bg-stone-200 group-hover/btn:w-12 transition-all" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Global CSS for the staggered reveal effect */}
      <style>{`
        @keyframes fadeSlideIn {
          from { 
            opacity: 0; 
            transform: translateY(15px); 
            filter: blur(4px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
            filter: blur(0);
          }
        }
      `}</style>
    </section>
  );
}
