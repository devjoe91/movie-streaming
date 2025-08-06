import { NextResponse } from "next/server";

interface Category {
  id: string;
  title: string;
}

export async function GET() {
  try {
    // Example: These could be static or fetched from somewhere
    const categories: Category[] = [
      { id: "feature_films", title: "Feature Films" },
      { id: "animationandcartoons", title: "Animation & Cartoons" },
      { id: "opensource_movies", title: "Open Source Movies" },
    ];

    return NextResponse.json(categories);
  } catch (err: unknown) {
    console.error("Error loading categories:", err);
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 }
    );
  }
}
