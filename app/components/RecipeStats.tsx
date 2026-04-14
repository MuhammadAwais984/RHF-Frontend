"use client";

import {
  FlameIcon,
  ClockIcon,
  UsersIcon,
  ActivityIcon,
  TimerIcon,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  clock: <ClockIcon className="w-5 h-5 text-red-700" />,
  flame: <FlameIcon className="w-5 h-5 text-red-700" />,
  timer: <TimerIcon className="w-5 h-5 text-red-700" />,
  users: <UsersIcon className="w-5 h-5 text-red-700" />,
  activity: <ActivityIcon className="w-5 h-5 text-red-700" />,
};
// Add this function
function formatValue(value: number, icon: string): string {
  const timeIcons = ["clock", "flame", "timer"];

  if (timeIcons.includes(icon?.toLowerCase())) {
    // Format as time (minutes → h/m)
    if (value < 60) return `${value} min`;
    const h = Math.floor(value / 60);
    const m = value % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }

  // Not a time field — just return the number as-is
  return String(value);
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

function getColClass(count: number): string {
  if (count <= 2) return "grid-cols-2";
  if (count === 3) return "grid-cols-1 md:grid-cols-3";
  if (count === 4) return "grid-cols-2 md:grid-cols-4";
  if (count === 5) return "grid-cols-1 md:grid-cols-5";
  return "grid-cols-2 md:grid-cols-3 lg:grid-cols-6";
}

export function RecipeStats({ recipe }: { recipe: any }) {
  const stats: { label: string; value: number; icon: string }[] =
    recipe?.stats ?? [];

  // Filter out any with no value
  const visibleStats = stats.filter((s) => s.value && s.value > 0);

  if (visibleStats.length === 0) return null;

  const colClass = getColClass(visibleStats.length);

  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="relative group bg-white rounded-3xl border border-stone-100 p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] hover:shadow-xl hover:shadow-stone-200/40 transition-all duration-500">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-red-700 rounded-b-full opacity-20 group-hover:w-48 transition-all duration-500" />

        <div className={`grid ${colClass} gap-y-8`}>
          {visibleStats.map((stat, idx) => (
            <div
              key={`${stat.label}-${idx}`}
              className={idx > 0 ? "border-l border-stone-100" : ""}
            >
              <StatItem
                icon={
                  iconMap[stat.icon?.toLowerCase()] ?? (
                    <ActivityIcon className="w-5 h-5 text-red-700" />
                  )
                }
                label={stat.label}
                value={formatValue(stat.value, stat.icon)} // ← replace String(stat.value)
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
