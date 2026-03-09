// app/components/RecipeHomepageClient.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Loader2,
  ArrowRight,
  UtensilsCrossed,
  Clock,
  Users,
  ChefHat,
  Star,
  Heart,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface FeaturedRecipe {
  id: number;
  title: string;
  slug: string;
  categoryName: string;
  categorySlug: string;
  imageUrl?: string;
  prepTime: number;
  totalTime: number;
  rating?: number;
  servings?: number;
}

interface TrendingCategory {
  name: string;
  slug: string;
  count: number;
  icon: string;
  color: string;
  imageUrl?: string; // ADD THIS
}

interface PlatformStats {
  recipes: number;
  categories: number;
  chefs: number;
  users: number;
}

interface Props {
  featuredRecipes: FeaturedRecipe[];
  trendingCategories: TrendingCategory[];
  stats: PlatformStats;
}

export default function RecipeHomepageClient({
  featuredRecipes,
  trendingCategories,
  stats,
}: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search suggestions
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const delay = setTimeout(async () => {
      setLoading(true);
      setIsOpen(true);
      try {
        const res = await fetch(`/api/search?q=${query}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(delay);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* HERO SECTION WITH SEARCH */}
      <div className="relative flex min-h-[70vh] items-center justify-center bg-[#FCFBF9] px-6 overflow-visible">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-[10%] left-[15%] w-64 h-64 bg-red-100/40 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[10%] right-[15%] w-96 h-96 bg-stone-200/30 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full max-w-2xl text-center"
          ref={containerRef}
        >
          <div className="space-y-4 mb-10">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600"
            >
              Discover & Taste
            </motion.span>
            <h1 className="text-5xl md:text-7xl font-serif italic text-stone-900 tracking-tight leading-tight">
              Find the best{" "}
              <span className="font-sans not-italic font-black text-red-800">
                Flavors
              </span>
            </h1>
          </div>

          {/* SEARCH FORM */}
          <div className="relative group">
            <motion.form
              layout
              onSubmit={handleSearch}
              className={`flex items-center bg-white border-2 transition-all duration-300 p-1.5 md:p-2 shadow-2xl shadow-stone-200/50 ${
                isOpen
                  ? "rounded-t-2xl md:rounded-t-[2rem] border-stone-200"
                  : "rounded-full border-transparent"
              }`}
            >
              <div className="pl-3 md:pl-4 pr-2">
                <Search className="w-4 h-4 md:w-5 md:h-5 text-stone-400" />
              </div>
              <input
                type="text"
                placeholder="Search recipes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 outline-none bg-transparent py-2.5 md:py-3 text-stone-800 text-base md:text-lg placeholder:text-stone-300 min-w-0"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-red-700 text-white px-5 md:px-8 py-2.5 md:py-3 rounded-full font-bold text-xs md:text-sm uppercase tracking-widest hover:bg-red-800 transition-all flex items-center gap-2 shrink-0"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Search"
                )}
              </motion.button>
            </motion.form>

            {/* SUGGESTIONS DROPDOWN */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 bg-white border-x-2 border-b-2 border-stone-100 rounded-b-2xl md:rounded-b-[2rem] shadow-2xl z-[100] overflow-hidden"
                >
                  <div className="max-h-[400px] overflow-y-auto">
                    {loading && suggestions.length === 0 && (
                      <div className="p-10 text-center space-y-3">
                        <Loader2 className="animate-spin w-6 h-6 text-red-500 mx-auto" />
                        <p className="text-xs uppercase tracking-widest text-stone-400 font-bold">
                          Curating...
                        </p>
                      </div>
                    )}
                    {!loading && suggestions.length === 0 && (
                      <div className="p-10 text-center text-sm text-stone-400">
                        No recipes found for &quot;{query}&quot;
                      </div>
                    )}
                    {suggestions.map((item, index) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() =>
                          router.push(
                            `/recipes/${item.categorySlug}/${item.slug}`,
                          )
                        }
                        className="w-full flex items-center gap-4 p-4 hover:bg-stone-50 transition-colors group/item border-b border-stone-50 last:border-none"
                      >
                        <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover transition-transform group-hover/item:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <UtensilsCrossed className="w-4 h-4 text-stone-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col text-left flex-1 min-w-0">
                          <span className="text-[10px] uppercase tracking-widest text-red-600 font-bold">
                            {item.categoryName || "Recipe"}
                          </span>
                          <span className="text-stone-900 font-bold text-base truncate group-hover/item:text-red-700 transition-colors">
                            {item.title}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-300 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Popular Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            {["Chicken", "Healthy", "Quick Dinner", "Desserts"].map((tag) => (
              <motion.button
                key={tag}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setQuery(tag)}
                className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-stone-200 text-stone-500 hover:border-red-500 hover:text-red-600 transition-all bg-white/50"
              >
                {tag}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* FEATURED RECIPES SECTION */}
      {/* FEATURED RECIPES SECTION */}
      <section className="py-16 md:py-24 px-2 sm:px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">
            Handpicked for You
          </span>
          <h2 className="text-4xl md:text-5xl font-serif italic text-stone-900 mt-2">
            Featured Recipes
          </h2>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory mx-4 px-4">
          {featuredRecipes.map((recipe, idx) => (
            <motion.div
              key={recipe.id}
              whileHover={{ y: -2 }}
              className="flex-none w-[78%] sm:w-[46%] md:w-[31%] lg:w-[24%] snap-start group"
            >
              <Link href={`/recipes/${recipe.categorySlug}/${recipe.slug}`}>
                <div className="rounded-2xl overflow-hidden bg-white border border-stone-100 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                  {/* Image */}
                  <div className="relative aspect-[18/12] overflow-hidden">
                    {recipe.imageUrl ? (
                      <Image
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                        <UtensilsCrossed className="w-10 h-10 text-stone-300" />
                      </div>
                    )}

                    {/* Gradient overlay - always visible, stronger on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                    {/* Favorite button - top right */}
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-110 transition-all duration-200"
                    >
                      <Heart className="w-3.5 h-3.5 text-red-600" />
                    </button>

                    {/* Time badge - bottom left, always visible */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      <Clock className="w-3 h-3" />
                      {recipe.totalTime} min
                    </div>

                    {/* Servings - bottom right */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      <Users className="w-3 h-3" />
                      {recipe.servings}
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="p-4">
                    {/* Category pill - top left */}
                    <div className="">
                      <span className="text-[10px] font-black uppercase tracking-widest backdrop-blur-sm text-red-600 py-1 rounded-full">
                        {recipe.categoryName}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 mt-2 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug">
                      {recipe.title}
                    </h3>
                    <div className="mt-auto pt-4 border-t border-slate-50">
                      <Link
                        href={`/recipes/${recipe.categorySlug}/${recipe.slug}`}
                        className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-stone-900 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest transition-colors duration-300 group/btn"
                      >
                        View Recipe
                        <ChevronRight
                          size={14}
                          className="transition-transform group-hover/btn:translate-x-0.5"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TRENDING CATEGORIES */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">
              Explore by Category
            </span>
            <h2 className="text-4xl md:text-5xl font-serif italic text-stone-900 mt-2">
              Trending Categories
            </h2>
          </div>

          {/* Replace the grid div with this */}
          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory px-4 sm:px-0">
            {trendingCategories.map((category) => (
              <motion.div
                key={category.slug}
                whileHover={{ y: -8 }}
                className="flex-none w-[70%] sm:w-[40%] md:w-[25%] lg:w-[18%] snap-start"
              >
                <Link
                  href={`/recipes/${category.slug}`}
                  className="group block bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  {/* Image Section */}
                  <div className="relative w-full aspect-[22/20] overflow-hidden bg-slate-100">
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${category.color} flex items-center justify-center`}
                      >
                        <span className="text-4xl">{category.icon}</span>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                      {category.count.toLocaleString()} recipes
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-serif italic text-stone-900 mt-2">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Search & Discover",
                desc: "Find recipes using our powerful search or browse categories",
                icon: Search,
              },
              {
                step: "02",
                title: "Save Favorites",
                desc: "Create collections and save recipes you love",
                icon: Heart,
              },
              {
                step: "03",
                title: "Cook & Share",
                desc: "Follow step-by-step instructions and share your creations",
                icon: ChefHat,
              },
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative p-8 bg-white rounded-3xl border border-stone-200 hover:shadow-2xl transition-all group"
              >
                <div className="text-6xl font-black text-stone-100 absolute top-6 right-6 group-hover:text-red-50 transition-colors">
                  {item.step}
                </div>
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-200 transition-colors relative z-10">
                  <item.icon className="w-7 h-7 text-red-700" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3 relative z-10">
                  {item.title}
                </h3>
                <p className="text-stone-600 relative z-10">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              {
                label: "Recipes",
                value: `${stats.recipes.toLocaleString()}+`,
                icon: UtensilsCrossed,
              },
              {
                label: "Categories",
                value: `${stats.categories}+`,
                icon: Star,
              },
              { label: "Chefs", value: `${stats.chefs}+`, icon: ChefHat },
              {
                label: "Users",
                value: `${(stats.users / 1000).toFixed(0)}k+`,
                icon: Users,
              },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-red-700" />
                </div>
                <p className="text-4xl font-bold text-stone-900 mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-stone-600 uppercase tracking-widest">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-red-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif italic mb-6">
              Ready to Start Cooking?
            </h2>
            <p className="text-xl mb-10 text-red-100">
              Join thousands of food lovers discovering new recipes every day
            </p>
            <Link href="/recipes">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-red-700 px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-red-50 transition-all shadow-2xl"
              >
                Browse All Recipes
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
