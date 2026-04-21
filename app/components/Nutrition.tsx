"use client";

import { ChevronDownIcon, InfoIcon, Activity, Zap } from "lucide-react";
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

// Fields that are shown as top-level macros or should be excluded from the detail rows
const EXCLUDED_DETAIL_KEYS = new Set([
  "calories",
  "protein",
  "carbohydrates",
  "totalFat",
  "nutritionSubtitle",
  "id",
  "documentId",
  "createdAt",
  "updatedAt",
  "publishedAt",
]);

// Known fields with units and highlight flag — add more as you expand Strapi
const FIELD_META: Record<
  string,
  { label: string; unit: string; highlight?: boolean }
> = {
  saturatedFat: { label: "Saturated Fat", unit: "g" },
  cholesterol: { label: "Cholesterol", unit: "mg" },
  sodium: { label: "Sodium", unit: "mg" },
  fiber: { label: "Dietary Fiber", unit: "g" },
  sugars: { label: "Sugars", unit: "g" },
  iron: { label: "Iron", unit: "%", highlight: true },
  vitaminA: { label: "Vitamin A", unit: "%", highlight: true },
  vitaminC: { label: "Vitamin C", unit: "%", highlight: true },
  vitaminD: { label: "Vitamin D", unit: "%", highlight: true },
  calcium: { label: "Calcium", unit: "%", highlight: true },
  potassium: { label: "Potassium", unit: "mg" },
  transFat: { label: "Trans Fat", unit: "g" },
  polyunsaturatedFat: { label: "Polyunsaturated Fat", unit: "g" },
  monounsaturatedFat: { label: "Monounsaturated Fat", unit: "g" },
};

// Converts unknown camelCase keys to readable labels e.g. "vitaminB12" → "Vitamin B 12"
function toReadableLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

export default function NutritionSection({ recipe, hasNutrition }: any) {
  const [showAll, setShowAll] = useState(false);

  if (!hasNutrition) return null;
  const n = recipe.nutrition;

  // Guard: hide entire section if nutrition object is missing or has no meaningful data
  if (!n || typeof n !== "object") return null;
  if (
    n.calories == null &&
    n.protein == null &&
    n.carbohydrates == null &&
    n.totalFat == null
  )
    return null;

  // Build detail rows dynamically from all keys not in the excluded set
  const detailRows = Object.entries(n).filter(([key, val]) => {
    if (EXCLUDED_DETAIL_KEYS.has(key)) return false;
    if (val == null) return false; // skip null/undefined
    // Show if value is 0 or greater (skip negatives just in case)
    if (typeof val === "number" && val < 0) return false;
    return true;
  });

  return (
    <section className="max-w-4xl mx-auto mt-12 font-sans">
      <div className="flex items-center gap-4 mb-10">
        <h2 className="text-4xl font-semibold text-stone-800">Nutritions</h2>
        <div className="h-px flex-1 bg-stone-200 mt-2"></div>
      </div>
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-stone-100 overflow-hidden">
        <div>
          {/* Header */}
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
            {/* LEFT SIDE: Calories */}
            <div className="bg-stone-900 text-white p-8 flex flex-row md:flex-col items-center justify-between md:justify-center md:min-w-[160px] relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Activity size={100} />
              </div>
              <div className="z-10 text-center flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 mb-2">
                  Total Energy
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter text-white">
                    {n.calories ?? "—"}
                  </span>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    kcal
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Macros + Details */}
            <div className="flex-1 flex flex-col">
              <div className="grid grid-cols-3 divide-x divide-stone-100">
                <Macro
                  label="Protein"
                  value={n.protein ?? "—"}
                  unit="g"
                  colorClass="text-emerald-500"
                />
                <Macro
                  label="Carbs"
                  value={n.carbohydrates ?? "—"}
                  unit="g"
                  colorClass="text-amber-500"
                />
                <Macro
                  label="Fat"
                  value={n.totalFat ?? "—"}
                  unit="g"
                  colorClass="text-rose-500"
                />
              </div>

              {/* Collapsible Details — auto-built from Strapi data */}
              {detailRows.length > 0 && (
                <>
                  <div
                    className={`px-8 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                      showAll
                        ? "max-h-[600px] pb-8 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-12">
                      {detailRows.map(([key, val]) => {
                        const meta = FIELD_META[key];
                        const label = meta?.label ?? toReadableLabel(key);
                        const unit = meta?.unit ?? "";
                        const highlight = meta?.highlight ?? false;
                        return (
                          <NutritionRow
                            key={key}
                            label={label}
                            value={`${val}${unit}`}
                            highlight={highlight}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Toggle Button */}
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
