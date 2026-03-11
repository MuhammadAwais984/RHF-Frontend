"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import FavoriteButton from "@/app/components/FavoriteButton";
import { ChevronRight, Eye, Loader2 } from "lucide-react";
import FilterBar from "./FilterBar";
import ShareButton from "./ShareButton";

interface RecipeCard {
  id: number;
  title: string;
  slug: string;
  prepTime: number;
  totalTime: number;
  viewsCount: number;
  favoritesCount: number;
  images: { url: string; altText: string }[];
  categorySlug?: string;
  categoryName?: string;
}

interface Props {
  initialRecipes: RecipeCard[];
  category: string;
}

export default function CategoryRecipesClient({
  initialRecipes,
  category,
}: Props) {
  const [recipes, setRecipes] = useState<RecipeCard[]>(initialRecipes);
  const [loading, setLoading] = useState(false);

  const handleFilteredRecipes = useCallback((filtered: RecipeCard[]) => {
    setRecipes(filtered);
  }, []);

  const handleLoading = useCallback((val: boolean) => {
    setLoading(val);
  }, []);

  const categoryName = recipes[0]?.categoryName || category;

  return (
    <main className="min-h-screen bg-[#FDFCFB]">
      {/* Hero Header */}
      <header className="relative py-24 px-6 bg-linear-to-br from-stone-900 via-red-800 to-stone-900 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-20" />
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <nav className="flex justify-center space-x-2 text-orange-400 text-sm font-medium mb-4 uppercase tracking-[0.2em]">
            <Link href="/recipes" className="hover:text-white transition">
              Recipes
            </Link>
            <span>/</span>
            <span className="text-white">{categoryName}</span>
          </nav>
          <h1 className="text-5xl md:text-6xl text-white capitalize tracking-tight">
            {categoryName} Collection
          </h1>
          <p className="mt-6 text-slate-300 max-w-xl mx-auto text-lg font-light leading-relaxed">
            Expertly curated {categoryName} recipes tested in our kitchen to
            ensure your success at home.
          </p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-20">
        {/* Filter Bar */}
        <FilterBar
          categorySlug={category}
          onFilteredRecipes={handleFilteredRecipes}
          onLoading={handleLoading}
        />

        {/* Loading Overlay */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="animate-spin text-red-800" />
          </div>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-slate-400 text-lg font-light">
              No recipes found for the selected filters.
            </p>
            <p className="text-slate-300 text-sm mt-2">
              Try adjusting or clearing your filters.
            </p>
          </div>
        )}

        {/* Recipe Grid */}
        {!loading && recipes.length > 0 && (
          <>
            <p className="text-sm text-slate-400 mb-6">
              Showing{" "}
              <span className="font-semibold text-slate-600">
                {recipes.length}
              </span>{" "}
              recipe{recipes.length !== 1 ? "s" : ""}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {recipes.map((recipe) => {
                const headImage = recipe.images[0];

                return (
                  <article
                    key={recipe.id}
                    className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                      <Link href={`/recipes/${category}/${recipe.slug}`}>
                        {headImage?.url ? (
                          <Image
                            src={headImage.url}
                            alt={headImage.altText || recipe.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <span className="text-xs uppercase tracking-widest">
                              No Image
                            </span>
                          </div>
                        )}
                      </Link>
                      <div className="absolute top-3 right-3 z-10">
                        <FavoriteButton
                          recipeId={recipe.id}
                          initialCount={recipe.favoritesCount}
                        />
                      </div>
                      <div className="absolute top-3 left-3 z-10 ">
                        {/* SHARE BUTTON - Icon variant */}
                        <ShareButton
                          url={`/recipes/${recipe.categorySlug}/${recipe.slug}`}
                          title={recipe.title}
                          description={`Check out this ${recipe.categoryName} recipe!`}
                          image={headImage?.url}
                          variant="icon"
                          size="md"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col grow">
                      <div className="flex items-center justify-between mb-3 text-slate-400">
                        <span className="text-[11px] font-bold uppercase tracking-widest">
                          {category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Eye size={14} />
                          <span className="text-xs font-medium">
                            {recipe.viewsCount.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/recipes/${category}/${recipe.slug}`}
                        className="mb-0"
                      >
                        <h2 className="text-2xl text-center font-semibold text-slate-900 leading-snug line-clamp-2 transition-colors group-hover:text-red-700">
                          {recipe.title}
                        </h2>
                      </Link>

                      <div className="mt-auto pt-4 border-t border-slate-50">
                        <Link
                          href={`/recipes/${category}/${recipe.slug}`}
                          className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-red-800 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-widest transition-colors duration-300 group/btn"
                        >
                          View Recipe
                          <ChevronRight
                            size={14}
                            className="transition-transform group-hover/btn:translate-x-0.5"
                          />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
