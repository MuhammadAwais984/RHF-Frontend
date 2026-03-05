"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, ArrowRight, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function GlobalSearchHero() {
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
    <div className="relative flex min-h-[70vh] items-center justify-center bg-[#FCFBF9] px-6 overflow-visible">
      {/* 1. Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[15%] w-64 h-64 bg-orange-100/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] right-[15%] w-96 h-96 bg-stone-200/30 rounded-full blur-3xl"
        />
      </div>

      <motion.main
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

        {/* 🔎 SEARCH FORM with Layout Animations */}
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

          {/* 💡 SUGGESTIONS DROPDOWN with AnimatePresence */}
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
                      <Loader2 className="animate-spin w-6 h-6 text-orange-500 mx-auto" />
                      <p className="text-xs uppercase tracking-widest text-stone-400 font-bold">
                        Curating...
                      </p>
                    </div>
                  )}

                  {!loading && suggestions.length === 0 && (
                    <div className="p-10 text-center text-sm text-stone-400">
                      No recipes found for "{query}"
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
                        <span className="text-[10px] uppercase tracking-widest text-orange-600 font-bold">
                          {item.categoryName || "Recipe"}
                        </span>
                        <span className="text-stone-900 font-bold text-base truncate group-hover/item:text-orange-700 transition-colors">
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
              className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-stone-200 text-stone-500 hover:border-orange-500 hover:text-orange-600 transition-all bg-white/50"
            >
              {tag}
            </motion.button>
          ))}
        </motion.div>
      </motion.main>
    </div>
  );
}
