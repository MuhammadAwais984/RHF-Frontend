"use client";

import { useEffect, useState, useCallback } from "react";
import {
  SlidersHorizontal,
  Check,
  RotateCcw,
  X,
  Utensils,
  Calendar,
  TrendingUp,
  Star,
  Clock,
  Sparkles,
  ChevronRight,
} from "lucide-react";

interface FilterOption {
  id: number;
  name: string;
  slug: string;
}

interface Filters {
  occasions: string[];
  mealTypes: string[];
  sort: string;
}

interface FilterBarProps {
  categorySlug: string;
  onFilteredRecipes: (recipes: any[]) => void;
  onLoading: (loading: boolean) => void;
}

const SORT_OPTIONS = [
  { label: "Default", value: "", icon: Sparkles, desc: "Our picks for you" },
  {
    label: "Most Popular",
    value: "viewsCount:desc",
    icon: TrendingUp,
    desc: "Trending right now",
  },
  {
    label: "Top Rated",
    value: "favouritesCount:desc",
    icon: Star,
    desc: "Highest favorites",
  },
  {
    label: "Newest",
    value: "createdAt:desc",
    icon: Clock,
    desc: "Recently added",
  },
];

export default function FilterBar({
  categorySlug,
  onFilteredRecipes,
  onLoading,
}: FilterBarProps) {
  const [occasions, setOccasions] = useState<FilterOption[]>([]);
  const [mealTypes, setMealTypes] = useState<FilterOption[]>([]);
  const [filters, setFilters] = useState<Filters>({
    occasions: [],
    mealTypes: [],
    sort: "",
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const API = process.env.NEXT_PUBLIC_STRAPI_URL;
  const activeCount =
    filters.occasions.length +
    filters.mealTypes.length +
    (filters.sort ? 1 : 0);
  const activeSortLabel =
    SORT_OPTIONS.find((o) => o.value === filters.sort)?.label || "Default";

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setTimeout(() => {
        document.body.style.overflow = "unset";
      }, 300);
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [occRes, mealRes] = await Promise.all([
          fetch(`${API}/api/occasions`),
          fetch(`${API}/api/meal-types`),
        ]);
        if (occRes.ok) {
          const data = await occRes.json();
          setOccasions(
            data.data.map((item: any) => ({
              id: item.id,
              name: item.Name,
              slug: item.slug,
            })),
          );
        }
        if (mealRes.ok) {
          const data = await mealRes.json();
          setMealTypes(
            data.data.map((item: any) => ({
              id: item.id,
              name: item.Name,
              slug: item.slug,
            })),
          );
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchOptions();
  }, [API]);

  const toggleArrayFilter = (key: "occasions" | "mealTypes", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const fetchFilteredRecipes = useCallback(async () => {
    onLoading(true);
    try {
      let url = `${API}/api/recipes?filters[recipe_category][slug][$eq]=${categorySlug}&populate=*`;
      filters.occasions.forEach(
        (slug, i) => (url += `&filters[occasions][slug][$in][${i}]=${slug}`),
      );
      filters.mealTypes.forEach(
        (slug, i) => (url += `&filters[meal_types][slug][$in][${i}]=${slug}`),
      );
      if (filters.sort) url += `&sort=${filters.sort}`;

      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      const mapped = json.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        prepTime: item.preptime ?? 0,
        totalTime: (item.preptime ?? 0) + (item.cookTime ?? 0),
        viewsCount: item.viewsCount ?? 0,
        favoritesCount: item.favouritesCount ?? 0,
        images: item.coverImages?.[0]?.url
          ? [{ url: `${API}${item.coverImages[0].url}`, altText: item.title }]
          : [],
        categorySlug: item.recipe_category?.slug,
        categoryName: item.recipe_category?.Name,
      }));
      onFilteredRecipes(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      onLoading(false);
    }
  }, [filters, categorySlug, API, onFilteredRecipes, onLoading]);

  useEffect(() => {
    fetchFilteredRecipes();
  }, [fetchFilteredRecipes]);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      {/* ── Toolbar ── */}
      <div className=" mb-10">
        <div className="flex ">
          {/* Left: Filter trigger + active pills */}
          <div className="flex items-center gap-3 min-w-0 ">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800 transition-all shrink-0 group"
            >
              <SlidersHorizontal
                size={15}
                className="text-red-400 group-hover:rotate-90 transition-transform duration-300"
              />
              Filters
              {activeCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold rounded-full ring-2 ring-white">
                  {activeCount}
                </span>
              )}
            </button>

            {/* Active pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {filters.occasions.map((slug) => (
                <ActivePill
                  key={slug}
                  label={occasions.find((o) => o.slug === slug)?.name || slug}
                  color="red"
                  onClear={() => toggleArrayFilter("occasions", slug)}
                />
              ))}
              {filters.mealTypes.map((slug) => (
                <ActivePill
                  key={slug}
                  label={mealTypes.find((m) => m.slug === slug)?.name || slug}
                  color="rose"
                  onClear={() => toggleArrayFilter("mealTypes", slug)}
                />
              ))}
              {activeCount > 0 && (
                <button
                  onClick={() =>
                    setFilters({ occasions: [], mealTypes: [], sort: "" })
                  }
                  className="shrink-0 text-[11px] font-semibold text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors ml-1"
                >
                  <RotateCcw size={11} /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Right: Sort pill */}
        </div>
      </div>

      {/* ── Sidebar Overlay ── */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-[2px] transition-opacity duration-300"
            style={{ opacity: isVisible ? 1 : 0 }}
            onClick={closeSidebar}
          />

          {/* Panel */}
          <div
            className="relative w-full max-w-[400px] h-full bg-[#FDFCFB] flex flex-col shadow-2xl transition-transform duration-300 ease-out"
            style={{
              transform: isVisible ? "translateX(0)" : "translateX(100%)",
            }}
          >
            {/* Decorative top bar */}
            <div className="h-1 w-full bg-gradient-to-r from-red-400 via-rose-500 to-stone-800" />

            {/* Header */}
            <div className="px-6 pt-6 pb-5 flex items-start justify-between border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                  Refine
                </h2>
                <p className="text-[13px] text-slate-400 mt-0.5">
                  {activeCount === 0
                    ? "No filters applied"
                    : `${activeCount} filter${activeCount > 1 ? "s" : ""} active`}
                </p>
              </div>
              <button
                onClick={closeSidebar}
                className="p-2 rounded-full hover:bg-slate-100 transition-colors mt-0.5"
              >
                <X size={18} className="text-slate-500" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* ── Sort By Section ── */}
              <div className="px-6 pt-6 pb-2">
                <SectionLabel icon={TrendingUp} label="Sort By" />
                <div className="mt-3 space-y-2">
                  {SORT_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = filters.sort === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() =>
                          setFilters((p) => ({
                            ...p,
                            sort: p.sort === opt.value ? "" : opt.value,
                          }))
                        }
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all duration-150 group ${
                          isActive
                            ? "bg-stone-900 border-stone-900 text-white shadow-md"
                            : "bg-white border-slate-200 hover:border-stone-300 hover:bg-stone-50"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? "bg-white/10"
                              : "bg-slate-100 group-hover:bg-red-50"
                          }`}
                        >
                          <Icon
                            size={16}
                            className={
                              isActive
                                ? "text-red-400"
                                : "text-slate-500 group-hover:text-red-600"
                            }
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-semibold ${isActive ? "text-white" : "text-stone-800"}`}
                          >
                            {opt.label}
                          </p>
                          <p
                            className={`text-[11px] mt-0.5 ${isActive ? "text-white/60" : "text-slate-400"}`}
                          >
                            {opt.desc}
                          </p>
                        </div>
                        {isActive && (
                          <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                            <Check
                              size={11}
                              className="text-stone-900"
                              strokeWidth={3}
                            />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="mx-6 my-5 h-px bg-slate-100" />

              {/* ── Occasions Section ── */}
              <div className="px-6 pb-2">
                <div className="flex items-center justify-between">
                  <SectionLabel icon={Calendar} label="Occasion" />
                  {filters.occasions.length > 0 && (
                    <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      {filters.occasions.length} selected
                    </span>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {occasions.length > 0 ? (
                    occasions.map((occ) => (
                      <SidebarChip
                        key={occ.id}
                        label={occ.name}
                        active={filters.occasions.includes(occ.slug)}
                        onClick={() => toggleArrayFilter("occasions", occ.slug)}
                        accentColor="red"
                      />
                    ))
                  ) : (
                    <SkeletonChips count={6} />
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="mx-6 my-5 h-px bg-slate-100" />

              {/* ── Meal Types Section ── */}
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between">
                  <SectionLabel icon={Utensils} label="Meal Type" />
                  {filters.mealTypes.length > 0 && (
                    <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                      {filters.mealTypes.length} selected
                    </span>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {mealTypes.length > 0 ? (
                    mealTypes.map((mt) => (
                      <SidebarChip
                        key={mt.id}
                        label={mt.name}
                        active={filters.mealTypes.includes(mt.slug)}
                        onClick={() => toggleArrayFilter("mealTypes", mt.slug)}
                        accentColor="rose"
                      />
                    ))
                  ) : (
                    <SkeletonChips count={6} />
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-4 border-t border-slate-100 space-y-3 bg-white">
              <button
                onClick={closeSidebar}
                className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold text-sm tracking-wide hover:bg-stone-800 active:scale-[0.98] transition-all shadow-lg shadow-stone-900/10 flex items-center justify-center gap-2"
              >
                <Sparkles size={15} className="text-red-400" />
                Show Results
              </button>
              {activeCount > 0 && (
                <button
                  onClick={() => {
                    setFilters({ occasions: [], mealTypes: [], sort: "" });
                    closeSidebar();
                  }}
                  className="w-full py-2.5 text-sm font-semibold text-slate-400 hover:text-rose-500 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw size={13} /> Reset all filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Sub-components ──

function SectionLabel({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={13} className="text-slate-400" />
      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </span>
    </div>
  );
}

function SidebarChip({
  label,
  active,
  onClick,
  accentColor,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  accentColor: "red" | "rose";
}) {
  const activeStyles = {
    red: "bg-red-50 border-red-300 text-red-800 ring-1 ring-red-200",
    rose: "bg-rose-50 border-rose-300 text-rose-800 ring-1 ring-rose-200",
  };
  const checkStyles = {
    red: "text-red-600",
    rose: "text-rose-600",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all border ${
        active
          ? activeStyles[accentColor]
          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <span className="truncate pr-1">{label}</span>
      {active && (
        <Check
          size={13}
          className={`shrink-0 ${checkStyles[accentColor]}`}
          strokeWidth={2.5}
        />
      )}
    </button>
  );
}

function ActivePill({
  label,
  color,
  onClear,
}: {
  label: string;
  color: "red" | "rose";
  onClear: () => void;
}) {
  const styles = {
    red: "bg-red-50 text-red-700 border-red-200 hover:border-red-300",
    rose: "bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-300",
  };
  return (
    <div
      className={`flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-lg border text-[11px] font-bold shrink-0 transition-colors ${styles[color]}`}
    >
      {label}
      <button
        onClick={onClear}
        className="ml-0.5 w-4 h-4 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
      >
        <X size={9} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function SkeletonChips({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-11 bg-slate-100 animate-pulse rounded-xl" />
      ))}
    </>
  );
}
