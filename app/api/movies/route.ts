import { NextResponse } from "next/server";

const SAFE_KEYWORDS = [
  "family", "classic", "animation", "cartoon", "drama", "adventure",
  "comedy", "educational", "kids", "documentary", "short", "feature"
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const rows = parseInt(searchParams.get("rows") || "20");

    let query = `mediatype:(movies)`;
    if (category) query = `collection:(${category})+AND+${query}`;

    const res = await fetch(
      `https://archive.org/advancedsearch.php?q=${query}&fl[]=identifier,title,creator&sort[]=downloads+desc&rows=${rows}&page=${page}&output=json`
    );
    const data = await res.json();

    const safeMovies = data.response.docs.filter((movie: any) => {
      const title = movie.title.toLowerCase();
      return SAFE_KEYWORDS.some((kw) => title.includes(kw));
    }).map((m: any) => ({
      id: m.identifier,
      title: m.title,
      creator: m.creator || "Unknown",
      playableUrl: `https://archive.org/embed/${m.identifier}`
    }));

    return NextResponse.json({
      movies: safeMovies,
      total: data.response.numFound,
      page
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ movies: [], total: 0, page: 1 });
  }
}
