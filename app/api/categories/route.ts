/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories: any[] = [
      { id: "feature_films", title: "Feature Films" },
      { id: "animationandcartoons", title: "Animation & Cartoons" },
      { id: "opensource_movies", title: "Open Source Movies" },
    ];

    return NextResponse.json(categories, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 }
    );
  }
}
