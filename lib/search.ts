import { NextRequest, NextResponse } from "next/server";

// Example: using your NestJS backend API
const BASE_URL = process.env.API_URL || "http://localhost:3000";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    if (!q) return NextResponse.json([]);

    // Call your backend search endpoint (replace with your actual search API)
    const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(q)}`);

    if (!res.ok) {
      console.error("Search API error", res.status);
      return NextResponse.json([]);
    }

    const data = await res.json();

    // Optionally, you can format the data for your frontend
    const results = data.map((item: any) => ({
      id: item.id,
      type: item.type, // "Recipe" | "Category" | "Ingredient"
      title: item.title,
      url: item.url, // route to the item
      image: item.image || "/placeholder.png",
    }));

    return NextResponse.json(results.slice(0, 10));
  } catch (err) {
    console.error(err);
    return NextResponse.json([]);
  }
}
