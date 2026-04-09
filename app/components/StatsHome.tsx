"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";
import { UtensilsCrossed, Star, ChefHat, Users } from "lucide-react";
import { useEffect, useState } from "react";

// --- Types ---
type ColorTheme = "red" | "amber" | "teal" | "blue";

const colorMap: Record<
  ColorTheme,
  { iconBg: string; text: string; bar: string }
> = {
  red: { iconBg: "bg-rose-50", text: "text-rose-600", bar: "bg-rose-500" },
  amber: { iconBg: "bg-amber-50", text: "text-amber-600", bar: "bg-amber-500" },
  teal: { iconBg: "bg-teal-50", text: "text-teal-600", bar: "bg-teal-500" },
  blue: { iconBg: "bg-blue-50", text: "text-blue-600", bar: "bg-blue-500" },
};

// --- Components ---

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1], // Custom "Professional" out-expo
        onUpdate: (latest) => setDisplay(Math.round(latest)),
      });
      return () => controls.stop();
    }
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums tracking-tighter">
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

function StatCard({
  label,
  target,
  suffix,
  icon: Icon,
  color,
  index,
}: {
  label: string;
  target: number;
  suffix: string;
  icon: any;
  color: ColorTheme;
  index: number;
}) {
  const theme = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="group relative flex flex-col items-center p-8 bg-white border border-slate-200/60 rounded-3xl transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-1"
    >
      {/* Subtle Hover Decoration */}
      <div
        className={`absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent ${theme.bar} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div
        className={`mb-5 p-3.5 rounded-2xl ${theme.iconBg} ${theme.text} transition-colors duration-500`}
      >
        <Icon size={24} strokeWidth={1.5} />
      </div>

      <div className="text-4xl md:text-5xl font-semibold text-slate-900 mb-1">
        <AnimatedNumber value={target} suffix={suffix} />
      </div>

      <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
        {label}
      </p>
    </motion.div>
  );
}

export function StatsSection({
  stats,
}: {
  stats: { recipes: number; categories: number; chefs: number; users: number };
}) {
  const statItems = [
    {
      label: "Recipes",
      target: stats.recipes,
      suffix: "+",
      icon: UtensilsCrossed,
      color: "red" as const,
    },
    {
      label: "Categories",
      target: stats.categories,
      suffix: "+",
      icon: Star,
      color: "amber" as const,
    },
    {
      label: "Top Chefs",
      target: stats.chefs,
      suffix: "",
      icon: ChefHat,
      color: "teal" as const,
    },
    {
      label: "Global Users",
      target: Math.round(stats.users / 1000),
      suffix: "k+",
      icon: Users,
      color: "blue" as const,
    },
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((item, i) => (
            <StatCard key={item.label} {...item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
