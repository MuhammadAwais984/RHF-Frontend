"use client";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  InfoIcon,
  Activity,
  Zap,
} from "lucide-react";
import { useState } from "react";

function Macro({ label, value, unit, colorClass }: any) {
  return (
    <div className="flex flex-col items-center px-2 py-4 transition-transform hover:scale-105">
      <span className="text-[10px] uppercase tracking-[0.15em] text-stone-400 font-bold mb-1">
        {label}
      </span>
      <div className="flex items-baseline gap-0.5">
        <span className="text-xl font-black text-stone-800 tracking-tight">
          {value}
        </span>
        <span className={`text-[10px] font-bold uppercase ${colorClass}`}>
          {unit}
        </span>
      </div>
    </div>
  );
}

function NutritionRow({ label, value, highlight }: any) {
  return (
    <div className="flex justify-between py-2 border-b border-stone-100/60 last:border-none group">
      <span className="text-xs text-stone-500 group-hover:text-stone-800 transition-colors">
        {label}
      </span>
      <span
        className={`text-xs font-bold tracking-tight ${
          highlight ? "text-amber-600 italic" : "text-stone-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function NutritionSection({ recipe, hasNutrition }: any) {
  const [showAll, setShowAll] = useState(false);

  if (!hasNutrition) return null;
  const n = recipe.nutrition;

  return (
    <section className="max-w-4xl mx-auto mt-12 font-sans">
      <div className="flex items-center gap-4 mb-10">
        <h2 className="text-4xl font-semibold text-stone-800">Nutritions</h2>
        <div className="h-px flex-1 bg-stone-200 mt-2"></div>
      </div>
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-stone-100 overflow-hidden">
        {!n ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-stone-300">
            <InfoIcon className="w-8 h-8 stroke-[1.5px]" />
            <p className="text-xs font-bold uppercase tracking-[0.2em]">
              Nutrition Analysis Pending
            </p>
          </div>
        ) : (
          <div>
            {/* Header: More elegant than solid black */}
            <div className="bg-stone-50 border-b border-stone-100 py-6 px-8 flex justify-between items-center">
              <div>
                <p className="text-xl font-black text-stone-900 italic">
                  {n.nutritionSubtitle || "Fuel Your Body"}
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-stone-100">
                <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row">
              {/* LEFT SIDE: Calories Focus */}
              <div className="bg-stone-900 text-white p-8 flex flex-row md:flex-col items-center justify-between md:justify-center md:min-w-[160px] relative overflow-hidden">
                {/* Subtle background decoration */}
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <Activity size={100} />
                </div>

                <div className="z-10 text-center md:text-center flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-2">
                    Total Energy
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tighter text-white">
                      {n.calories}
                    </span>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                      kcal
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: Macros */}
              <div className="flex-1 flex flex-col">
                <div className="grid grid-cols-3 divide-x divide-stone-100">
                  <Macro
                    label="Protein"
                    value={n.protein}
                    unit="g"
                    colorClass="text-emerald-500"
                  />
                  <Macro
                    label="Carbs"
                    value={n.carbohydrates}
                    unit="g"
                    colorClass="text-amber-500"
                  />
                  <Macro
                    label="Fat"
                    value={n.totalFat}
                    unit="g"
                    colorClass="text-rose-500"
                  />
                </div>

                {/* Collapsible Details */}
                <div
                  className={`px-8 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    showAll
                      ? "max-h-[500px] pb-8 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-12">
                    <NutritionRow
                      label="Saturated Fat"
                      value={`${n.saturatedFat}g`}
                    />
                    <NutritionRow
                      label="Cholesterol"
                      value={`${n.cholesterol}mg`}
                    />
                    <NutritionRow label="Sodium" value={`${n.sodium}mg`} />
                    <NutritionRow label="Dietary Fiber" value={`${n.fiber}g`} />
                    <NutritionRow label="Total Sugars" value={`${n.sugars}g`} />
                    <NutritionRow label="Iron" value={`${n.iron}%`} highlight />
                    <NutritionRow
                      label="Vitamin A"
                      value={`${n.vitaminA}%`}
                      highlight
                    />
                    <NutritionRow
                      label="Calcium"
                      value={`${n.calcium}%`}
                      highlight
                    />
                  </div>
                </div>

                {/* Action Bar */}
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="w-full py-4 group flex items-center justify-center gap-3 hover:bg-stone-50 transition-all"
                >
                  <div className="h-[1px] w-8 bg-stone-200 group-hover:w-12 transition-all" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 group-hover:text-stone-900">
                    {showAll ? "Collapse" : "Full Nutrition Facts"}
                  </span>
                  <div
                    className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
                  >
                    <ChevronDownIcon className="w-3 h-3 text-amber-600" />
                  </div>
                  <div className="h-[1px] w-8 bg-stone-200 group-hover:w-12 transition-all" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
