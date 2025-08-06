"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/"); // Redirect to home after login
      } else {
        router.push("/login");
      }
    };
    getUser();
  }, [router]);

  return <p className="text-white">Signing you in...</p>;
}
