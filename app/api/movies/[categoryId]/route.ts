// app/api/movies/[categoryId]/route.ts
import { NextResponse } from "next/server";

interface ArchiveDoc {
  identifier: string;
  title: string;
  creator?: string;
  year?: string;
}

interface ArchiveResponse {
  response: {
    docs: ArchiveDoc[];
  };
}

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  const { categoryId } = params;
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";

  try {
    const banned = ["sex", "porn", "hentai", "xxx", "nude"];

    const res = await fetch(
      `https://archive.org/advancedsearch.php?q=collection:${categoryId}+AND+mediatype:movies&fl[]=identifier,title,creator,year&sort[]=downloads+desc&rows=12&page=${page}&output=json`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from Archive.org" },
        { status: res.status }
      );
    }

    const data: ArchiveResponse = await res.json();

    const movies = data.response.docs
      .filter((d) => !banned.some((w) => d.title?.toLowerCase().includes(w)))
      .map((d) => ({
        id: d.identifier,
        title: d.title,
        year: d.year || "",
        creator: d.creator || "Unknown",
        thumbnail: `https://archive.org/download/${d.identifier}/__ia_thumb.jpg`,
      }));

    return NextResponse.json(movies);
  } catch (err: unknown) {
    console.error("Error fetching category movies:", err);
    return NextResponse.json(
      { error: "Failed to fetch category movies" },
      { status: 500 }
    );
  }
}
