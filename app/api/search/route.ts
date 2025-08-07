import { NextResponse } from "next/server";

const API_KEY = '182d1d4f59msh975ec84952ddd53p1c7bffjsn0ad869327bec';
const API_HOST = 'streaming-availability.p.rapidapi.com';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  if (!query) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const res = await fetch(
      `https://streaming-availability.p.rapidapi.com/shows/search/title?title=${encodeURIComponent(query)}&country=us&show_type=movie&output_language=en`,
      {
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST,
        },
        cache: "no-store"
      }
    );

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    const data = await res.json();

    const movies = data?.map((show: any) => ({
      id: show.id,
      title: show.title,
      year: show.releaseYear || "",
      creator: show.directors?.[0] || "Unknown",
      thumbnail: show.imageSet?.verticalPoster?.w360 || show.imageSet?.horizontalPoster?.w360 || "/placeholder.jpg",
      description: show.overview || "No description available",
      rating: show.rating || 0,
      genres: show.genres || [],
      streamingOptions: show.streamingOptions || {}
    })) || [];

    return NextResponse.json(movies, { status: 200 });
  } catch (err) {
    console.error("Search API Error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}