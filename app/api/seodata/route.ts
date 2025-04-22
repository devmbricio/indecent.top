import { NextRequest, NextResponse } from "next/server";
import { fetchPostsForLocation, getAllLocations } from "@/lib/data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") || "";
  const country = searchParams.get("country") || "";

  if (!city || !country) {
    return NextResponse.json({ error: "City and Country are required" }, { status: 400 });
  }

  try {
    const posts = await fetchPostsForLocation(city, country, 10);
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
