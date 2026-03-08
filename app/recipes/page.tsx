// app/recipes/page.tsx
import { fetchCategories } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

// --- Type definitions ---
interface RecipeCategory {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string; // ✅ allow missing images
  altText?: string;
}

// --- Metadata for the page ---
export const metadata = {
  title: "Recipe Categories | MyRecipes",
  description: "Browse all recipe categories and discover delicious dishes.",
  openGraph: {
    title: "Recipe Categories | MyRecipes",
    description: "Browse all recipe categories and discover delicious dishes.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/recipes`,
    siteName: "MyRecipes",
  },
  twitter: {
    title: "Recipe Categories | MyRecipes",
    description: "Browse all recipe categories and discover delicious dishes.",
  },
};
async function getCategoryBySlug(
  slug: string,
): Promise<{ name: string; slug: string }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/recipe-categories?filters[slug][$eq]=${slug}`,
  );
  if (!res.ok) throw new Error("Failed to fetch category");
  const json = await res.json();
  const cat = json.data[0];
  return {
    name: cat?.attributes?.Name || slug,
    slug: cat?.attributes?.slug || slug,
  };
}
// --- Structured data JSON-LD ---
function CategoriesStructuredData(categories: RecipeCategory[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Recipe Categories",
    itemListElement: categories.map((cat, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: cat.name,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/recipes/${cat.slug}`,
      image: cat.imageUrl,
    })),
  };
}
function mapCategories(strapiData: any[]) {
  return strapiData.map((item) => {
    // Works for both Strapi v4 and v5
    const image = item.categoryImage?.data?.attributes || item.categoryImage; // v4 // v5

    const imageUrl = image?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${image.url}`
      : undefined;

    return {
      id: item.id,
      name: item.Name,
      slug: item.slug,
      imageUrl,
      altText: image?.alternativeText || item.Name || "Recipe category image",
    };
  });
}

// --- Page component ---
export default async function RecipeCategories() {
  const data = await fetchCategories();
  const categories = mapCategories(data);
  // Add structured data to the page (for SEO)
  const structuredData = CategoriesStructuredData(categories);

  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <span className="text-red-700 font-semibold tracking-widest uppercase text-xs">
          Delicious Discovery
        </span>

        <h1 className="mt-3 text-4xl md:text-5xl  text-slate-900">
          Browse by Category
        </h1>

        <p className="mt-4 text-slate-500 max-w-2xl text-lg">
          From quick weekday dinners to elaborate weekend feasts.
        </p>
      </header>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/recipes/${cat.slug}`}
              className="group relative block aspect-26/30 overflow-hidden rounded-2xl shadow-2xl"
            >
              {cat.imageUrl ? (
                <Image
                  src={cat.imageUrl}
                  alt={cat.altText || cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                  No Image
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute bottom-0 p-6 text-white">
                <h2 className="text-2xl font-bold">{cat.name}</h2>
                <p className="text-sm text-slate-200 opacity-0 group-hover:opacity-100 transition">
                  Explore Recipes →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
