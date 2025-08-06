import { NextResponse } from "next/server";

const SAFE_KEYWORDS = [
  "family", "classic", "animation", "cartoon", "drama", "adventure",
  "comedy", "educational", "kids", "documentary", "short", "feature"
];

export async function GET() {
  try {
    const res = await fetch(
      `https://archive.org/advancedsearch.php?q=collection:(feature_films)+AND+mediatype:(movies)&fl[]=identifier,title,creator&sort[]=downloads+desc&rows=50&page=1&output=json`
    );
    const data = await res.json();

    const safeMovies = data.response.docs.filter((movie: any) => {
      const title = movie.title.toLowerCase();
      return SAFE_KEYWORDS.some((kw) => title.includes(kw));
    });

    // Pick 3 random movies
    const shuffled = safeMovies.sort(() => 0.5 - Math.random());
    const top3 = shuffled.slice(0, 3).map((m: any) => ({
      id: m.identifier,
      title: m.title,
      creator: m.creator || "Unknown",
      playableUrl: `https://archive.org/embed/${m.identifier}`
    }));

    return NextResponse.json({ movies: top3 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ movies: [] });
  }
}
