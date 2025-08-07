import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Define categories based on genres available in the streaming API
    const categories = [
      { id: "action", title: "Action" },
      { id: "comedy", title: "Comedy" },
      { id: "drama", title: "Drama" },
      { id: "horror", title: "Horror" },
      { id: "thriller", title: "Thriller" },
      { id: "romance", title: "Romance" },
      { id: "scifi", title: "Sci-Fi" },
      { id: "fantasy", title: "Fantasy" },
      { id: "animation", title: "Animation" },
      { id: "documentary", title: "Documentary" }
    ];

    return NextResponse.json(categories, { status: 200 });
  } catch (err) {
    console.error("Categories API Error:", err);
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 }
    );
  }
}