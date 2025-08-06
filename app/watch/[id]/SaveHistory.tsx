"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SaveHistory({ movieId }: { movieId: string }) {
  useEffect(() => {
    const save = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from("watch_history")
          .insert([{ user_id: user.id, movie_id: movieId }]);

        if (error) {
          console.error("Error saving watch history:", error);
        }
      }
    };

    save();
  }, [movieId]);

  return null;
}
