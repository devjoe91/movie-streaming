import { NextResponse } from "next/server";

const API_KEY = '182d1d4f59msh975ec84952ddd53p1c7bffjsn0ad869327bec';
const API_HOST = 'streaming-availability.p.rapidapi.com';

// Map category IDs to genre IDs used by the API
const GENRE_MAP: { [key: string]: string } = {
  "action": "action",
  "comedy": "comedy", 
  "drama": "drama",
  "horror": "horror",
  "thriller": "thriller",
  "romance": "romance",
  "scifi": "scifi",
  "fantasy": "fantasy",
  "animation": "animation",
  "documentary": "documentary"
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  const { categoryId } = await params;
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";

  try {
    const genre = GENRE_MAP[categoryId] || categoryId;
    
    const res = await fetch(
      `https://streaming-availability.p.rapidapi.com/shows/search/filters?series_granularity=show&order_direction=desc&order_by=popularity_1year&genres_relation=and&output_language=en&show_type=movie&country=us&genres=${genre}&page=${page}`,
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

    return NextResponse.json(movies);
  } catch (err) {
    console.error("Category Movies API Error:", err);
    return NextResponse.json({ error: "Failed to fetch category movies" }, { status: 500 });
  }
}