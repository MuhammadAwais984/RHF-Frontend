// app/page.tsx
import RecipeHomepageClient from "@/app/components/RecipeHomepageClient";
import { fetchCategories } from "@/lib/api";

// Types
interface RecipeCategory {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
  altText?: string;
  recipeCount?: number;
  createdAt: string; // ADD THIS
}

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

// Fetch categories with recipe count
async function getCategoriesWithCount(): Promise<RecipeCategory[]> {
  const API = process.env.NEXT_PUBLIC_STRAPI_URL;

  try {
    const res = await fetch(`${API}/api/recipe-categories?populate=*`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch categories");

    const json = await res.json();

    return json.data.map((item: any) => {
      const image = item.categoryImage?.data?.attributes || item.categoryImage;
      const imageUrl = image?.url
        ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${image.url}`
        : undefined;

      return {
        id: item.id,
        name: item.Name,
        slug: item.slug,
        imageUrl,
        altText: image?.alternativeText || item.Name || "Recipe category image",
        recipeCount: item.recipes?.length || 0,
        createdAt: item.createdAt || "", // ADD THIS
      };
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Fetch featured recipes (top 6 by views or favorites)
async function getFeaturedRecipes(): Promise<FeaturedRecipe[]> {
  const API = process.env.NEXT_PUBLIC_STRAPI_URL;

  try {
    // const res = await fetch(
    //   `${API}/api/recipes?populate=*&sort[0]=viewsCount:desc&pagination[limit]=15`, // ← 6 to 9
    //   { cache: "no-store" },
    // );
    // In page.tsx - getFeaturedRecipes()
    const res = await fetch(
      `${API}/api/recipes?populate=*&sort[0]=createdAt:desc&pagination[limit]=15`,
      { cache: "no-store" },
    );

    if (!res.ok) throw new Error("Failed to fetch recipes");

    const json = await res.json();

    return json.data.map((item: any) => {
      const firstImage = item.coverImages?.[0];
      const imageUrl = firstImage?.url
        ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${firstImage.url}`
        : undefined;

      return {
        id: item.id,
        title: item.title,
        slug: item.slug,
        categoryName: item.recipe_category?.Name || "Recipe",
        categorySlug: item.recipe_category?.slug || "",
        imageUrl,
        prepTime: item.preptime || 0,
        totalTime: (item.preptime || 0) + (item.cookTime || 0),
        rating: item.rating || 4.5,
        servings: item.servings || 4,
      };
    });
  } catch (error) {
    console.error("Error fetching featured recipes:", error);
    return [];
  }
}

// Fetch platform stats
async function getPlatformStats() {
  const API = process.env.NEXT_PUBLIC_STRAPI_URL;

  try {
    // Fetch recipes count
    const recipesRes = await fetch(`${API}/api/recipes?pagination[limit]=1`, {
      cache: "no-store",
    });
    const recipesData = await recipesRes.json();
    const recipesCount = recipesData.meta?.pagination?.total || 0;

    // Fetch categories count
    const categoriesRes = await fetch(
      `${API}/api/recipe-categories?pagination[limit]=1`,
      { cache: "no-store" },
    );
    const categoriesData = await categoriesRes.json();
    const categoriesCount = categoriesData.meta?.pagination?.total || 0;

    return {
      recipes: recipesCount,
      categories: categoriesCount,
      chefs: 500, // Static for now
      users: 50000, // Static for now
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      recipes: 0,
      categories: 0,
      chefs: 500,
      users: 50000,
    };
  }
}

// Metadata
export const metadata = {
  title: "RHF - Recipe Hub Food | Discover Amazing Recipes",
  description:
    "Find the best flavors and recipes. Browse thousands of delicious recipes from various categories.",
  openGraph: {
    title: "RHF - Recipe Hub Food",
    description: "Find the best flavors and recipes",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "RHF",
  },
};

// Page Component
export default async function HomePage() {
  // Fetch all data in parallel
  const [categories, featuredRecipes, stats] = await Promise.all([
    getCategoriesWithCount(),
    getFeaturedRecipes(),
    getPlatformStats(),
  ]);

  const trendingCategories = categories
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)) // newest first
    .slice(0, 12)
    .map((cat) => ({
      name: cat.name,
      slug: cat.slug,
      count: cat.recipeCount || 0,
      icon: getCategoryIcon(cat.name),
      color: getCategoryColor(cat.name),
      imageUrl: cat.imageUrl,
    }));

  // Get top 3 featured recipes for the featured section
  const topFeaturedRecipes = featuredRecipes.slice(0, 9);

  return (
    <RecipeHomepageClient
      featuredRecipes={topFeaturedRecipes}
      trendingCategories={trendingCategories}
      stats={stats}
    />
  );
}

// Helper function to get category icon (you can customize this)
function getCategoryIcon(categoryName: string): string {
  const iconMap: { [key: string]: string } = {
    Italian: "🍝",
    Asian: "🍜",
    Mexican: "🌮",
    Desserts: "🍰",
    Breakfast: "🥞",
    Healthy: "🥗",
    Quick: "⚡",
    Vegetarian: "🥕",
    Seafood: "🐟",
    BBQ: "🍖",
  };

  // Try to find a matching icon
  for (const [key, icon] of Object.entries(iconMap)) {
    if (categoryName.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }

  return "🍽️"; // Default icon
}

// Helper function to get category color gradient
function getCategoryColor(categoryName: string): string {
  const colorMap: { [key: string]: string } = {
    Italian: "from-red-100 to-orange-100",
    Asian: "from-yellow-100 to-red-100",
    Mexican: "from-orange-100 to-yellow-100",
    Desserts: "from-pink-100 to-purple-100",
    Breakfast: "from-orange-100 to-yellow-100",
    Healthy: "from-green-100 to-emerald-100",
    Quick: "from-green-100 to-teal-100",
    Vegetarian: "from-green-100 to-lime-100",
    Seafood: "from-blue-100 to-cyan-100",
    BBQ: "from-red-100 to-orange-100",
  };

  for (const [key, color] of Object.entries(colorMap)) {
    if (categoryName.toLowerCase().includes(key.toLowerCase())) {
      return color;
    }
  }

  return "from-gray-100 to-stone-100"; // Default color
}
