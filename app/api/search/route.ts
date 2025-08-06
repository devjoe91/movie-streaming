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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const res = await fetch(
      `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
        query
      )}+AND+mediatype:movies&fl[]=identifier,title,creator,year&sort[]=downloads+desc&rows=12&page=1&output=json`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to search movies" },
        { status: res.status }
      );
    }

    const data: ArchiveResponse = await res.json();

    const movies = data.response.docs.map((d) => ({
      id: d.identifier,
      title: d.title,
      year: d.year || "",
      creator: d.creator || "Unknown",
      thumbnail: `https://archive.org/download/${d.identifier}/__ia_thumb.jpg`,
    }));

    return NextResponse.json(movies);
  } catch (err: unknown) {
    console.error("Error searching movies:", err);
    return NextResponse.json(
      { error: "Failed to search movies" },
      { status: 500 }
    );
  }
}
