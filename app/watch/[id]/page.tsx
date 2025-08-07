"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

interface MovieDetail {
  id: string;
  title: string;
  creator: string;
  description: string;
  playableUrl: string;
}

interface Movie {
  id: string;
  title: string;
  creator: string;
  thumbnail: string;
}

function isSafeTitle(title: string) {
  const banned = ["sex", "porn", "hentai", "xxx", "nude"];
  return !banned.some((w) => title.toLowerCase().includes(w));
}

async function fetchMovieDetails(id: string): Promise<MovieDetail | null> {
  const res = await fetch(`https://archive.org/metadata/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.metadata) return null;

  const playableFile = data.files.find((f: any) =>
    f.name?.toLowerCase().endsWith(".mp4")
  );

  return {
    id,
    title: data.metadata.title || "Untitled",
    creator: data.metadata.creator || "Unknown",
    description: data.metadata.description || "No description available.",
    playableUrl: playableFile
      ? `https://archive.org/download/${id}/${encodeURIComponent(playableFile.name)}`
      : "",
  };
}

async function fetchRelatedMovies(currentId: string): Promise<Movie[]> {
  const res = await fetch(
    `https://archive.org/advancedsearch.php?q=collection:feature_films+AND+mediatype:movies&fl[]=identifier,title,creator&sort[]=downloads+desc&rows=15&page=1&output=json`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.response.docs
    .filter((d: any) => isSafeTitle(d.title) && d.identifier !== currentId)
    .map((d: any) => ({
      id: d.identifier,
      title: d.title,
      creator: d.creator || "Unknown",
      thumbnail: `https://archive.org/download/${d.identifier}/__ia_thumb.jpg`,
    }));
}

async function saveWatchHistory(userId: string, movieId: string) {
  const { error } = await supabase
    .from("watch_history")
    .insert([{ user_id: userId, movie_id: movieId }]);

  if (error) {
    console.error("Error saving watch history:", error);
  }
}

export default function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [related, setRelated] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      const { id } = params;
      setLoading(true);
      setError(null);
      
      const movieData = await fetchMovieDetails(id);
      if (!movieData) {
        setError("Movie not found. The requested movie may not exist or may have been removed.");
        setLoading(false);
        return;
      }
      
      setMovie(movieData);
      
      try {
        const relatedMovies = await fetchRelatedMovies(id);
        setRelated(relatedMovies);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await saveWatchHistory(user.id, id);
        }
      } catch (err) {
        console.error("Error loading related content:", err);
      }
      
      setLoading(false);
    };

    loadData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1f1c17] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading movie...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1f1c17] text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🎬</div>
          <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link 
            href="/" 
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-[#1f1c17] text-white">
      <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Player + Info */}
        <div className="md:col-span-2">
          {movie.playableUrl ? (
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 shadow-lg">
              <video
                key={movie.id}
                src={movie.playableUrl}
                autoPlay
                controls
                preload="metadata"
                className="w-full h-full"
              />
            </div>
          ) : (
            <p className="text-red-400">No playable video found for this movie.</p>
          )}

          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="text-sm text-gray-400 mb-4">By {movie.creator}</p>
          <p className="text-base leading-relaxed">{movie.description}</p>
        </div>

        {/* Right: Related Movies */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Related Movies</h2>
          <div className="flex flex-col gap-4">
            {related.map((m) => (
              <Link key={m.id} href={`/watch/${m.id}`}>
                <div className="flex gap-3 cursor-pointer hover:bg-[#2a2620] p-2 rounded-lg">
                  <img
                    src={m.thumbnail}
                    alt={m.title}
                    className="w-32 h-20 object-cover rounded-md"
                  />
                  <div>
                    <p className="text-sm font-medium line-clamp-2">{m.title}</p>
                    <p className="text-xs text-gray-400">{m.creator}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}