"use client";

import {
  FlameIcon,
  ClockIcon,
  UsersIcon,
  ActivityIcon,
  TimerIcon,
} from "lucide-react";

function formatTime(minutes?: number | null): string | null {
  if (!minutes || minutes <= 0) return null;
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 text-center">
      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
        {icon}
      </div>
      <p className="text-xs text-stone-400 uppercase tracking-widest font-medium">
        {label}
      </p>
      <p className="text-lg font-semibold text-stone-800">{value}</p>
    </div>
  );
}

export function RecipeStats({ recipe }: { recipe: any }) {
  const allStats = [
    {
      key: "cookTime",
      icon: <FlameIcon className="w-5 h-5 text-red-700" />,
      label: "Cook Time",
      value: formatTime(recipe.cookTime),
    },
    {
      key: "prepTime",
      icon: <ClockIcon className="w-5 h-5 text-red-700" />,
      label: "Prep Time",
      value: formatTime(recipe.preptime),
    },
    {
      key: "soakTime",
      icon: <TimerIcon className="w-5 h-5 text-red-700" />,
      label: "Soak Time",
      value: formatTime(recipe.soakTime),
    },
    {
      key: "marinateTime",
      icon: <TimerIcon className="w-5 h-5 text-red-700" />,
      label: "Marinate Time",
      value: formatTime(recipe.marinateTime),
    },
    {
      key: "servings",
      icon: <UsersIcon className="w-5 h-5 text-red-700" />,
      label: "Servings",
      value: recipe.servings ? `${recipe.servings}` : null,
    },
  ];

  // Only keep stats that have a real value
  const visibleStats = allStats.filter((s) => s.value !== null);

  if (visibleStats.length === 0) return null;

  // Pick a sensible column count based on how many stats are visible
  const colClass =
    visibleStats.length <= 2
      ? "grid-cols-2"
      : visibleStats.length === 3
        ? "grid-cols-3"
        : visibleStats.length === 4
          ? "grid-cols-2 md:grid-cols-4"
          : visibleStats.length === 5
            ? "grid-cols-2 md:grid-cols-5"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-6";

  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="relative group bg-white rounded-3xl border border-stone-100 p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] hover:shadow-xl hover:shadow-stone-200/40 transition-all duration-500">
        {/* Accent bar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-red-700 rounded-b-full opacity-20 group-hover:w-48 transition-all duration-500" />

        <div className={`grid ${colClass} gap-y-8`}>
          {visibleStats.map((stat, idx) => (
            <div
              key={stat.key}
              className={idx > 0 ? "border-l border-stone-100" : ""}
            >
              <StatItem
                icon={stat.icon}
                label={stat.label}
                value={stat.value!}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
