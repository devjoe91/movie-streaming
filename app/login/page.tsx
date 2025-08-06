"use client";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signInWithFacebook = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Sign In</h1>
      <button
        onClick={signInWithGoogle}
        className="bg-red-500 px-4 py-2 rounded mb-4"
      >
        Continue with Google
      </button>
      <button
        onClick={signInWithFacebook}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        Continue with Facebook
      </button>
    </div>
  );
}
