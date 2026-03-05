import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");

  if (!query) return NextResponse.json([]);

  const encoded = encodeURIComponent(query);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/recipes?filters[title][$containsi]=${encoded}&fields[0]=title&fields[1]=slug&populate[recipe_category][fields][0]=slug&populate[coverImages][fields][0]=url&pagination[pageSize]=5`,
    { cache: "no-store" },
  );

  const json = await res.json();

  const BASE = process.env.NEXT_PUBLIC_STRAPI_URL;

  const results = json.data.map((r: any) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    categorySlug: r.recipe_category?.slug,
    image: r.coverImages?.[0]?.url ? `${BASE}${r.coverImages[0].url}` : null,
  }));

  return NextResponse.json(results);
}
