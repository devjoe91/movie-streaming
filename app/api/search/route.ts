import { NextResponse } from "next/server";

interface SearchDoc {
  identifier: string;
  title: string;
  creator?: string;
  year?: string;
}

interface SearchResponse {
  response: {
    docs: SearchDoc[];
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json([], { status: 200 });
  }

  const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
    query
  )}+AND+mediatype:movies&fl[]=identifier,title,creator,year&sort[]=downloads+desc&rows=10&page=1&output=json`;

  const res = await fetch(url);
  if (!res.ok) {
    return NextResponse.json([], { status: 500 });
  }

  const data: SearchResponse = await res.json();

  const results = data.response.docs.map((d) => ({
    id: d.identifier,
    title: d.title,
    year: d.year || "",
    creator: d.creator || "Unknown",
    thumbnail: `https://archive.org/download/${d.identifier}/__ia_thumb.jpg`,
  }));

  return NextResponse.json(results, { status: 200 });
}
