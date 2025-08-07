import { NextResponse } from "next/server";

const API_KEY = '182d1d4f59msh975ec84952ddd53p1c7bffjsn0ad869327bec';
const API_HOST = 'streaming-availability.p.rapidapi.com';

export async function GET() {
  try {
    const res = await fetch(
      "https://streaming-availability.p.rapidapi.com/shows/search/filters?series_granularity=show&order_direction=desc&order_by=popularity_1year&genres_relation=and&output_language=en&show_type=movie&country=us&page=1",
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

    const movies = data.shows?.map((show: any) => ({
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
    console.error("Movies API Error:", err);
    return NextResponse.json({ error: "Failed to load movies" }, { status: 500 });
  }
}