// app/api/popular/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const banned = ["sex", "porn", "hentai", "xxx", "nude"];
    const res = await fetch(
      `https://archive.org/advancedsearch.php?q=collection:feature_films+AND+mediatype:movies&fl[]=identifier,title,creator,year&sort[]=downloads+desc&rows=20&page=1&output=json`,
      { cache: "no-store" }
    );
    const data = await res.json();

    const movies = data.response.docs
      .filter((d: any) => !banned.some((w) => d.title?.toLowerCase().includes(w)))
      .map((d: any) => ({
        id: d.identifier,
        title: d.title,
        year: d.year || "",
        creator: d.creator || "Unknown",
        thumbnail: `https://archive.org/download/${d.identifier}/__ia_thumb.jpg`,
      }));

    return NextResponse.json(movies);
  } catch {
    return NextResponse.json({ error: "Failed to fetch popular movies" }, { status: 500 });
  }
}
