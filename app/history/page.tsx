"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

interface HistoryItem {
  movie_id: string;
  title: string;
  thumbnail: string;
}

export default function WatchHistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      // ✅ Get logged-in user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setLoading(false);
        return;
      }
      setUser(userData.user);

      // ✅ Fetch watch history
      const { data, error } = await supabase
        .from("watch_history")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching history:", error);
      } else {
        // Optionally fetch title/thumbnail from Archive.org API
        const enrichedHistory = await Promise.all(
          data.map(async (item) => {
            const res = await fetch(`https://archive.org/metadata/${item.movie_id}`);
            if (!res.ok) {
              return {
                movie_id: item.movie_id,
                title: "Unknown Movie",
                thumbnail: "/placeholder.jpg",
              };
            }
            const movieData = await res.json();
            return {
              movie_id: item.movie_id,
              title: movieData.metadata?.title || "Untitled",
              thumbnail: `https://archive.org/download/${item.movie_id}/__ia_thumb.jpg`,
            };
          })
        );
        setHistory(enrichedHistory);
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-300">Loading watch history...</p>;
  }

  if (!user) {
    return <p className="text-center mt-10 text-gray-300">Please log in to view your watch history.</p>;
  }

  if (history.length === 0) {
    return <p className="text-center mt-10 text-gray-300">You haven’t watched any movies yet.</p>;
  }

  return (
    <div className="min-h-screen bg-[#1f1c17] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">📜 Your Watch History</h1>
      <div className="flex flex-col gap-4">
        {history.map((item) => (
          <div
            key={item.movie_id}
            className="flex items-center bg-[#2a2620] rounded-lg overflow-hidden shadow hover:shadow-lg transition"
          >
            {/* Thumbnail */}
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-32 h-20 object-cover"
            />

            {/* Movie Info */}
            <div className="flex-1 p-3">
              <h2 className="text-lg font-medium">{item.title}</h2>
            </div>

            {/* Actions */}
            <div className="flex gap-2 p-3">
              <Link
                href={`/watch/${item.movie_id}`}
                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-black rounded text-sm"
              >
                ▶ Play
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
