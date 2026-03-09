// app/recipes/[category]/page.tsx  — SERVER COMPONENT
import CategoryRecipesClient from "@/app/components/CategoryRecipesClient";
import { Metadata } from "next";

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

function mapRecipes(strapiRecipes: any[]): RecipeCard[] {
  const API = process.env.NEXT_PUBLIC_STRAPI_URL;
  return strapiRecipes.map((item) => {
    const firstImage = item.coverImages?.[0];
    const imageUrl = firstImage?.url ? `${API}${firstImage.url}` : null;

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
      categorySlug: item.recipe_category?.slug,
      categoryName: item.recipe_category?.Name,
    };
  });
}

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

// --- SEO Metadata ---
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
    description: `Browse our collection of delicious ${capitalizedCategory} recipes.`,
    openGraph: {
      title: `${capitalizedCategory} Recipes | MyRecipes`,
      description: `Browse our collection of delicious ${capitalizedCategory} recipes.`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/recipes/${category}`,
      siteName: "MyRecipes",
    },
  };
}

// --- JSON-LD Structured Data ---
function RecipeStructuredData(recipes: RecipeCard[], category: string) {
  const structuredRecipes = recipes.map((r) => ({
    "@type": "Recipe",
    name: r.title,
    image: r.images?.[0]?.url || "",
    author: { "@type": "Person", name: "MyRecipes" },
    prepTime: `PT${r.prepTime}M`,
    totalTime: `PT${r.totalTime}M`,
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

// --- Page ---
export default async function CategoryRecipesPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const initialRecipes = await getRecipes(category);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            RecipeStructuredData(initialRecipes, category),
          ),
        }}
      />
      <CategoryRecipesClient
        initialRecipes={initialRecipes}
        category={category}
      />
    </>
  );
}
