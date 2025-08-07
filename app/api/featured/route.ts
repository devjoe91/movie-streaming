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

    if (data.shows && data.shows.length > 0) {
      const featuredMovie = data.shows[0];
      const movie = {
        id: featuredMovie.id,
        title: featuredMovie.title,
        year: featuredMovie.releaseYear || "",
        creator: featuredMovie.directors?.[0] || "Unknown",
        thumbnail: featuredMovie.imageSet?.verticalPoster?.w360 || featuredMovie.imageSet?.horizontalPoster?.w360 || "/placeholder.jpg",
        description: featuredMovie.overview || "No description available",
        rating: featuredMovie.rating || 0,
        genres: featuredMovie.genres || [],
        streamingOptions: featuredMovie.streamingOptions || {}
      };

      return NextResponse.json(movie, { status: 200 });
    }

    return NextResponse.json(null, { status: 200 });
  } catch (err) {
    console.error("Featured API Error:", err);
    return NextResponse.json({ error: "Failed to load featured movies" }, { status: 500 });
  }
}