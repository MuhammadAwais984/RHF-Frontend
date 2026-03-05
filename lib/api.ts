const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function fetchRecipes() {
  const res = await fetch(`${API_URL}/api/recipes?populate=*`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch recipes");

  const json = await res.json();
  return json.data;
}
export async function fetchCategories() {
  const res = await fetch(`${API_URL}/api/recipe-categories?populate=*`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch categories");

  const json = await res.json();
  return json.data;
}
