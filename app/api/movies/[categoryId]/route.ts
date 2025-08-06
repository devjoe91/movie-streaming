/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  const { categoryId } = await params;
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";

  try {
    const banned = ["sex", "porn", "hentai", "xxx", "nude"];
    const res = await fetch(
      `https://archive.org/advancedsearch.php?q=collection:${categoryId}+AND+mediatype:movies&fl[]=identifier,title,creator,year&sort[]=downloads+desc&rows=12&page=${page}&output=json`,
      { cache: "no-store" }
    );
    const data: any = await res.json();

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
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch category movies" }, { status: 500 });
  }
}
