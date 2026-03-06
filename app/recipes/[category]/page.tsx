import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import FavoriteButton from "@/app/components/FavoriteButton";
import { ChevronRight, Clock, Eye } from "lucide-react";

interface RecipeCard {
  id: number;
  title: string;
  slug: string;
  prepTime: number;
  totalTime: number;
  viewsCount: number;
  favoritesCount: number;
  images: { url: string; altText: string }[];

  // ✅ ADD THESE (because Strapi returns them)
  categorySlug?: string;
  categoryName?: string;
}
// Helper to render stars based on rating

async function getRecipes(categorySlug: string): Promise<RecipeCard[]> {
  const API = process.env.NEXT_PUBLIC_STRAPI_URL;

  const res = await fetch(
    `${API}/api/recipes?filters[recipe_category][slug][$eq]=${categorySlug}&populate=*`,
    { cache: "no-store" },
  );

  if (!res.ok) throw new Error("Failed to fetch recipes");

  const json = await res.json();

  return mapRecipes(json.data);
}
function mapRecipes(strapiRecipes: any[]): RecipeCard[] {
  return strapiRecipes.map((item) => {
    const firstImage = item.coverImages?.[0];
    const imageUrl = firstImage?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${firstImage.url}`
      : null;

    return {
      id: item.id,
      title: item.title,
      slug: item.slug,
      prepTime: item.preptime ?? 0,
      totalTime: (item.preptime ?? 0) + (item.cookTime ?? 0),
      viewsCount: item.viewsCount ?? 0,
      favoritesCount: item.favouritesCount ?? 0,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              altText: firstImage?.alternativeText || item.title,
            },
          ]
        : [],
      // ADD THIS:
      categorySlug: item.recipe_category?.slug,
      categoryName: item.recipe_category?.Name,
    };
  });
}

// --- Generate dynamic metadata for SEO ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const capitalizedCategory =
    category.charAt(0).toUpperCase() + category.slice(1);

  return {
    title: `${capitalizedCategory} Recipes | MyRecipes`,
    description: `Browse our collection of delicious ${capitalizedCategory} recipes, cooking tips, and easy-to-follow instructions.`,
    openGraph: {
      title: `${capitalizedCategory} Recipes | MyRecipes`,
      description: `Browse our collection of delicious ${capitalizedCategory} recipes, cooking tips, and easy-to-follow instructions.`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/recipes/${category}`,
      siteName: "MyRecipes",
    },
    twitter: {
      title: `${capitalizedCategory} Recipes | MyRecipes`,
      description: `Delicious ${capitalizedCategory} recipes and cooking tips.`,
    },
  };
}

// --- Structured Data JSON-LD for SEO ---
function RecipeStructuredData(recipes: RecipeCard[], category: string) {
  const structuredRecipes = recipes.map((r) => ({
    "@type": "Recipe",
    name: r.title,
    image: r.images?.[0]?.url || "",
    author: { "@type": "Person", name: "MyRecipes" },
    prepTime: `PT${r.prepTime}M`,
    cookTime: `PT${r.totalTime}M`,
    totalTime: `PT${r.totalTime}M`,
    aggregateRating: {
      "@type": "AggregateRating",
      reviewCount: r.viewsCount.toString(),
    },
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/recipes/${category}/${r.slug}`,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category} Recipes`,
    itemListElement: structuredRecipes.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: r,
    })),
  };
}

// --- Page component ---
export default async function CategoryRecipes({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const recipes = await getRecipes(category);

  return (
    <main className="min-h-screen bg-[#FDFCFB]">
      {" "}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(RecipeStructuredData(recipes, category)),
        }}
      />
      <header className="relative py-24 px-6 bg-gradient-to-br from-stone-900 via-red-800 to-stone-900 overflow-hidden shadow-2xl">
        {" "}
        <div className="absolute inset-0 opacity-20">
          {/* Subtle texture or pattern here */}
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <nav className="flex justify-center space-x-2 text-orange-400 text-sm font-medium mb-4 uppercase tracking-[0.2em]">
            <Link href="/recipes" className="hover:text-white transition">
              Recipes
            </Link>
            <span>/</span>
            <span className="text-white">
              {recipes[0]?.categoryName || category}
            </span>{" "}
          </nav>
          <h1 className="text-5xl md:text-6xl font-black text-white capitalize tracking-tight">
            {recipes[0]?.categoryName || category} Collection
          </h1>
          <p className="mt-6 text-slate-300 max-w-xl mx-auto text-lg font-light leading-relaxed">
            Expertly curated {recipes[0]?.categoryName || category} recipes
            tested in our kitchen to ensure your success at home.
          </p>
        </div>
      </header>
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {recipes.map((recipe) => {
            // Pick the HEAD image for this recipe
            const headImage = recipe.images[0];

            return (
              <article key={recipe.id} className="group flex flex-col">
                <div className="relative aspect-[4/3] rounded-4xl overflow-hidden bg-slate-100 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1">
                  <Link href={`/recipes/${category}/${recipe.slug}`}>
                    {headImage?.url ? (
                      <Image
                        src={headImage.url}
                        alt={headImage.altText || recipe.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </Link>

                  {/* Favorite button */}
                  <div className="absolute top-4 right-4 flex justify-between items-start">
                    <FavoriteButton
                      recipeId={recipe.id}
                      initialCount={recipe.favoritesCount}
                    />
                  </div>
                </div>

                {/* Text content */}
                <div className="mt-6 px-2">
                  <div className="flex items-center justify-between mb-3"></div>

                  <Link href={`/recipes/${recipe.categorySlug}/${recipe.slug}`}>
                    {" "}
                    <div className="flex justify-between ">
                      <h2 className="text-2xl font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                        {recipe.title}
                      </h2>
                      <div className="flex items-center text-slate-400 gap-1">
                        <Eye size={14} />
                        <span className="text-xs font-medium">
                          {recipe.viewsCount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href={`/recipes/${category}/${recipe.slug}`}
                    className="mt-4 inline-flex items-center text-sm font-bold text-slate-900 group/btn"
                  >
                    View Recipe
                    <ChevronRight
                      size={16}
                      className="ml-1 transition-transform group-hover/btn:translate-x-1 text-orange-600"
                    />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
