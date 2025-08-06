// app/api/categories/route.ts
import { NextResponse } from "next/server";

let cachedCategories: any[] | null = null;

export async function GET() {
  if (cachedCategories) {
    return NextResponse.json(cachedCategories);
  }

  try {
    const res = await fetch(
      "https://archive.org/advancedsearch.php?q=mediatype:movies&fl[]=collection&rows=50&page=1&output=json",
      { cache: "no-store" }
    );
    const data = await res.json();

    const banned = ["sex", "porn", "hentai", "xxx", "nude"];
    const categories = Array.from(
      new Set(data.response.docs.map((d: any) => d.collection).flat())
    )
      .filter((name) => name && !banned.some((b) => name.toLowerCase().includes(b)))
      .map((name) => ({
        id: name,
        title: name.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      }));

    // Put Feature Films first
    const sorted = categories.sort((a, b) => {
      if (a.id === "feature_films") return -1;
      if (b.id === "feature_films") return 1;
      return a.title.localeCompare(b.title);
    });

    cachedCategories = sorted.slice(0, 10);
    return NextResponse.json(cachedCategories);
  } catch (err) {
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}
