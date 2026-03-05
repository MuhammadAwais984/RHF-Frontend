import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

async function searchRecipes(query: string) {
  if (!query) return [];

  const encoded = encodeURIComponent(query); // ✅ important

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/recipes?filters[title][$containsi]=${encoded}&populate=*`,
    { cache: "no-store" },
  );

  const json = await res.json();

  const BASE = process.env.NEXT_PUBLIC_STRAPI_URL;

  return json.data.map((recipe: any) => ({
    id: recipe.id,
    title: recipe.title,
    slug: recipe.slug,
    categorySlug: recipe.recipe_category?.slug,
    image: recipe.coverImages?.[0]?.url
      ? `${BASE}${recipe.coverImages[0].url}`
      : null,
  }));
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams; // ✅ MUST await
  const query = params.q || "";

  const results = await searchRecipes(query);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl mb-10">
        Results for: <span className="text-red-600">{query}</span>
      </h1>

      {results.length === 0 && <p>No recipes found.</p>}

      <div className="grid md:grid-cols-3 gap-8">
        {results.map((recipe: any) => (
          <Link
            key={recipe.id}
            href={`/recipes/${recipe.categorySlug}/${recipe.slug}`}
            className="group"
          >
            <div className="rounded-xl overflow-hidden shadow-md">
              {recipe.image && (
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  width={400}
                  height={300}
                  className="object-cover group-hover:scale-105 transition"
                />
              )}

              <div className="p-4 bg-white">
                <h3 className="font-semibold">{recipe.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
