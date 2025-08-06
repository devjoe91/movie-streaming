import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Temporary static categories for NavBar
    const categories = [
      { id: "feature_films", title: "Feature Films" },
      { id: "short_films", title: "Short Films" },
      { id: "documentaries", title: "Documentaries" },
      { id: "animation", title: "Animation" },
      { id: "comedy", title: "Comedy" },
    ];

    return NextResponse.json(categories, { status: 200 });
  } catch (err) {
    console.error("Error fetching categories:", err);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
