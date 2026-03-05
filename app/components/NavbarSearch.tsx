"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, ArrowRight, UtensilsCrossed, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function NavbarSearch({ isSearchOpen, setIsSearchOpen }: any) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle Fetching
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const delay = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${query}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[80]"
          />

          {/* Search Bar Container */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="fixed top-0 left-0 w-full bg-white shadow-2xl z-[90] py-4 px-6"
          >
            <div className="max-w-3xl mx-auto" ref={containerRef}>
              <form onSubmit={handleSearch} className="flex items-center gap-4">
                <Search className="text-stone-400" size={20} />
                <input
                  autoFocus
                  type="text"
                  placeholder="What are you craving?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-lg text-stone-800 placeholder:text-stone-300 py-2"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-stone-500" />
                </button>
              </form>

              {/* Suggestions Panel */}
              <AnimatePresence>
                {query.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-white mt-2"
                  >
                    <div className="max-h-[60vh] overflow-y-auto pt-4 border-t border-stone-100">
                      {loading && suggestions.length === 0 && (
                        <div className="flex items-center justify-center py-10 gap-3">
                          <Loader2
                            className="animate-spin text-red-600"
                            size={20}
                          />
                          <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
                            Searching Heritage...
                          </span>
                        </div>
                      )}

                      {suggestions.map((item, index) => (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          onClick={() => {
                            router.push(
                              `/recipes/${item.categorySlug}/${item.slug}`,
                            );
                            setIsSearchOpen(false);
                          }}
                          className="w-full flex items-center gap-4 p-3 hover:bg-stone-50 transition-colors rounded-xl mb-1 group"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <UtensilsCrossed
                                  size={16}
                                  className="text-stone-300"
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-[10px] font-black uppercase text-red-600 tracking-tighter">
                              {item.categoryName}
                            </p>
                            <p className="text-stone-900 font-bold truncate group-hover:text-red-700 transition-colors">
                              {item.title}
                            </p>
                          </div>
                          <ArrowRight
                            size={16}
                            className="text-stone-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                          />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
