// app/api/search/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  try {
    const banned = ["sex", "porn", "hentai", "xxx", "nude"];
    const res = await fetch(
      `https://archive.org/advancedsearch.php?q=title:(${encodeURIComponent(
        query
      )})+AND+mediatype:movies&fl[]=identifier,title,creator,year&sort[]=downloads+desc&rows=10&page=1&output=json`,
      { cache: "no-store" }
    );
    const data = await res.json();

    const results = data.response.docs
      .filter((d: any) => !banned.some((b) => d.title?.toLowerCase().includes(b)))
      .map((d: any) => ({
        id: d.identifier,
        title: d.title,
        year: d.year || "",
        creator: d.creator || "",
        thumbnail: `https://archive.org/download/${d.identifier}/__ia_thumb.jpg`,
      }));

    return NextResponse.json(results);
  } catch (err) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
